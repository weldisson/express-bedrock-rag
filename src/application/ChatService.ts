import type { Readable } from "node:stream";
import type { FilesRepositoryDomain } from "../domain/FilesRepository";
import { BedrockProvider } from "../infrastructure/providers/BedRockProvider";
import logger from "../interfaces/helpers/Logger";
import { Helpers } from "../interfaces/helpers";
import type { Document } from "@langchain/core/documents";

export class ChatService {
  bedrockProvider;
  helpers;
  constructor(private fileRepository: FilesRepositoryDomain) {
    this.bedrockProvider = new BedrockProvider();
    this.helpers = new Helpers();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async create(content: string): Promise<Readable | any> {
    try {
      const systemMessageContext = `Assistant helps employees of Accenture OneStudio with questions and support requests regarding the career plan. Be brief in your responses. Respond only in plain text format.
          Respond ONLY with information from the sources below. If there is not enough information in the sources, say you don't know. Do not generate answers that do not use the sources. If asking a clarifying question to the user helps, ask the question.
          If the user's question is not in English, respond in the language used in the question.

          Each source has the format "file name: information". ALWAYS reference the file name for each part used in the response. Use the format "[filename]" to reference a source, for example: [info1.txt]. List each source separately, for example: [info1.txt][info2.pdf].

          Generate three very brief follow-up questions that the user is likely to ask next.
          Place the follow-up questions in double brackets. Example:
          <<Can I invite friends to a party?>>
          <<How can I request a refund?>>
          <<What if I break something?>>

          Do not repeat questions that have already been asked.
          Ensure the last question ends with ">>".

          SOURCES:
          {context}`;

      const res = await this.bedrockProvider.chat(
        content,
        systemMessageContext
      );

      return this.helpers.iterableToStream(res);
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
