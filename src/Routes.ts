import express from "express";

import { ChatService } from "./application/ChatService";
import { FileRepository } from "./infrastructure/repositories/FileRepository";
import { CurrencyController } from "./interfaces/controllers/ChatController";
import { setupSwagger } from "./interfaces/validations/Swagger";

const fileRepository = new FileRepository();
const chatService = new ChatService(fileRepository);
const chatController = new CurrencyController(chatService);

export const routers = (app: express.Application) => {
	app.use(express.json());
	app.get("/api/health", (_: express.Request, res: express.Response) => {
		res.status(200).json({ status: "ok" });
	});
	chatController.registerRoutes(app);
	setupSwagger(app);
};
