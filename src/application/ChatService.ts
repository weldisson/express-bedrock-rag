import "dotenv";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { HumanMessage } from "@langchain/core/messages";

import type { FilesRepositoryDomain } from "../domain/FilesRepository";
import logger from "../interfaces/helpers/Logger";

export class ChatService {
  constructor(private fileRepository: FilesRepositoryDomain) {}

  async create(content: string): Promise<string> {
    try {
      logger.info("content is ", content);
      await this.fileRepository.readFile();

      const model = new BedrockChat({
        model: "anthropic.claude-3-sonnet-20240229-v1:0",
        region: process.env.BEDROCK_AWS_REGION as string,
        credentials: {
          accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY as string,
        },
      });

      const res = await model.invoke([
        new HumanMessage({ content: "Tell me a joke" }),
      ]);
      logger.info(res);

      const stream = await model.stream([
        new HumanMessage({ content: "Tell me a joke" }),
      ]);

      for await (const chunk of stream) {
        logger.info(chunk.content);
      }
      return "chat success";
    } catch (error) {
      logger.error(error);
      return "chat error";
    }
  }
}
