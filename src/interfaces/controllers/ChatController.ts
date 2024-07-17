import type express from "express";
import type { ChatService } from "../../application/ChatService";
import logger from "../helpers/Logger";
import { chatSchema } from "../validations/Schemas";
import { validate } from "../validations/Validate";

export class CurrencyController {
	constructor(private chatService: ChatService) {}
	registerRoutes(app: express.Application) {
		app.post("/api/chat", validate(chatSchema), this.chatHandler.bind(this));
	}
	async chatHandler(req: express.Request, res: express.Response) {
		try {
			const { content } = req.body;
			logger.info("Starting message");
			const result = await this.chatService.create(content);

			res.writeHead(200, {
				"Content-Type": "text/plain; charset=utf-8",
			});
			result.pipe(res);
		} catch (error) {
			logger.error(`Error: ${error}`);
			res.status(400).json({
				statusCode: 400,
				message: (error as Error).message,
			});
		}
	}
}
