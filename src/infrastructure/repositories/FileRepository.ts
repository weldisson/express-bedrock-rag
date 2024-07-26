import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
	type DistanceStrategy,
	PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { PoolConfig } from "pg";

import type { Document, DocumentInterface } from "@langchain/core/documents";
import type {
	FilesRepositoryDomain,
	Metadata,
} from "../../domain/FilesRepository";
import logger from "../../interfaces/helpers/Logger";
import { BedrockProvider } from "../providers/BedRockProvider";

export class FileRepository implements FilesRepositoryDomain {
	bedrockProvider: BedrockProvider;
	pgVectorConfig;

	constructor() {
		this.bedrockProvider = new BedrockProvider();
		this.pgVectorConfig = {
			postgresConnectionOptions: {
				type: "postgres",
				host: process.env.DB_HOST,
				port: Number(process.env.DB_HOST),
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_DATABASE,
			} as PoolConfig,
			tableName: "embeddings",
			columns: {
				idColumnName: "id",
				vectorColumnName: "vector",
				contentColumnName: "content",
				metadataColumnName: "metadata",
			},
			distanceStrategy: "cosine" as DistanceStrategy,
		};
	}

	async addDocuments(
		docs: Array<{ pageContent: string; metadata: Metadata; vector: number[] }>,
	): Promise<void> {
		try {
			const pgVectorStore = await PGVectorStore.initialize(
				this.bedrockProvider.embedding(),
				this.pgVectorConfig,
			);

			await pgVectorStore.addDocuments(docs);
			await pgVectorStore.end();
		} catch (error) {
			logger.error(error);
			throw new Error("error on FileRepository > addDocuments");
		}
	}
	async similaritySearch(
		term: string,
		topK: number,
	): Promise<DocumentInterface[]> {
		try {
			const pgVectorStore = await PGVectorStore.initialize(
				this.bedrockProvider.embedding(),
				this.pgVectorConfig,
			);

			const result = await pgVectorStore.similaritySearch(term, topK);
			await pgVectorStore.end();

			return result;
		} catch (error) {
			logger.error(error);
			throw new Error("error on FileRepository > similaritySearch");
		}
	}

	async readFiles(filePath: string): Promise<Document[]> {
		try {
			if (filePath.length === 0)
				throw new Error("filePaths array could not be empty");

			const loader = new PDFLoader(filePath);
			const docs = await loader.load();
			const splitter = new RecursiveCharacterTextSplitter({
				chunkSize: 1500,
				chunkOverlap: 100,
			});
			const documents = await splitter.splitDocuments(docs);

			return documents;
		} catch (error) {
			logger.error(error);
			throw new Error("error on FileRepository > readFiles");
		}
	}
}
