import "dotenv";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { type AIMessageChunk, HumanMessage } from "@langchain/core/messages";
import logger from "../../interfaces/helpers/Logger";
import type { IterableReadableStream } from "@langchain/core/dist/utils/stream";
import { Readable } from "node:stream";

export class BedrockModelProvider {
  async execute(
    content: string
  ): Promise<Readable> {
    try {
      const model = new BedrockChat({
        model: process.env.BEDROCK_AWS_MODEL,
        region: process.env.BEDROCK_AWS_REGION as string,
        credentials: {
          accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY as string,
        },
      });

      const res = await model.stream([new HumanMessage({ content })]);

      return this.iterableToStream(res);
    } catch (error) {
      logger.error(error);
      throw new Error("Error invoking model");
    }
  }

  iterableToStream(iterable: IterableReadableStream<AIMessageChunk>) {
    const iterator = iterable[Symbol.asyncIterator]();
    return new Readable({
      async read() {
        const { value, done } = await iterator.next();
        if (done) {
          this.push(null);
        } else {
          this.push(value.content || "");
        }
      },
    });
  }
}
