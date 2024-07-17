import type { Readable } from "node:stream";
import { IterableReadableStream } from "@langchain/core/dist/utils/stream";
import type { AIMessageChunk } from "@langchain/core/messages";
import type { FilesRepositoryDomain } from "../domain/FilesRepository";
import { BedrockModelProvider } from "../infrastructure/providers/BedRockModelProvider";
import logger from "../interfaces/helpers/Logger";

export class ChatService {
	constructor(private fileRepository: FilesRepositoryDomain) {}

	async create(content: string): Promise<Readable> {
		try {
			// const pdfFileData = await this.fileRepository.readFile("./Example.pdf");
			// logger.info(pdfFileData);
			const model = new BedrockModelProvider();

			const res = await model.execute(content);

			return res;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
