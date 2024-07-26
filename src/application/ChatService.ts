import type { Readable } from "node:stream";
import type { Document } from "@langchain/core/documents";
import type { FilesRepositoryDomain } from "../domain/FilesRepository";
import { BedrockProvider } from "../infrastructure/providers/BedRockProvider";
import { Helpers } from "../interfaces/helpers";
import logger from "../interfaces/helpers/Logger";

export class ChatService {
  bedrockProvider;
  helpers;
  constructor(private fileRepository: FilesRepositoryDomain) {
    this.bedrockProvider = new BedrockProvider();
    this.helpers = new Helpers();
  }

  async create(content: string): Promise<Readable> {
    try {
      const systemMessageContext = `Assistant helps employees of Accenture OneStudio with questions and support requests regarding the career plan. Be brief in your responses. Respond only in plain text format.
          Respond ONLY with information from the sources below. If there is not enough information in the sources, say you don't know. Do not generate answers that do not use the sources. If asking a clarifying question to the user helps, ask the question.
          If the user's question is not in English, respond in the language used in the question.
          
          SOURCES:
          {context}`;

      const res = await this.bedrockProvider.chat(
        content,
        systemMessageContext
      );
      const documents = await this.fileRepository.similaritySearch(content, 5);
      const relevantContent = documents
        .map((doc) => `${doc.metadata.filename}: ${doc.pageContent}`)
        .join("\n");

      const context = systemMessageContext.replace(
        "{context}",
        relevantContent
      );

      const response = await this.bedrockProvider.chat(content, context);
      return this.helpers.iterableToStream(response);
    } catch (error) {
      logger.error(error);
      throw new Error("Error on ChatService > create");
    }
  }

  async addFile(path: string): Promise<void> {
    try {
      const fileChunks: Array<Document> = await this.fileRepository.readFiles(
        path
      );
      for (const doc of fileChunks) {
        const vector = await this.bedrockProvider.embedQuery(doc.pageContent);
        const docs = [
          {
            pageContent: doc.pageContent,
            metadata: doc.metadata,
            vector,
          },
        ];
        await this.fileRepository.addDocuments(docs);
      }
    } catch (error) {
      logger.error(error);
      throw new Error("error on ChatService > addFile");
    }
  }
}
