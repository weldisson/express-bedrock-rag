import "dotenv";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import logger from "../../interfaces/helpers/Logger";

export class BedrockProvider {
	async chat(content: string, systemMessageContext: string) {
		try {
			const model = new BedrockChat({
				model: process.env.BEDROCK_AWS_CHAT_MODEL,
				region: process.env.BEDROCK_AWS_REGION as string,
				credentials: {
					accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID as string,
					secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY as string,
				},
				modelKwargs: {
					max_tokens: 2048,
					temperature: 0.0,
					top_k: 250,
					top_p: 1,
				},
			});
			const res = await model.stream([
				new SystemMessage({
					content: systemMessageContext,
				}),
				new HumanMessage({ content }),
			]);

			return res;
		} catch (error) {
			logger.error(error);
			throw new Error("Error on BedrockProvider > chat");
		}
	}
	async embedQuery(content: string): Promise<number[]> {
		try {
			const query = await this.embedding().embedQuery(content);
			return query;
		} catch (error) {
			logger.error(error);
			throw new Error("Error on BedrockProvider > embedQuery");
		}
	}

	embedding(): EmbeddingsInterface {
		try {
			const embeddings = new BedrockEmbeddings({
				region: process.env.BEDROCK_AWS_REGION as string,
				credentials: {
					accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID as string,
					secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY as string,
				},
				model: process.env.BEDROCK_AWS_EMBED_MODEL,
			});

			return embeddings;
		} catch (error) {
			logger.error(error);
			throw new Error("Error on BedrockProvider > embedding");
		}
	}
}
