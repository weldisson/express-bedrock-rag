import express from "express";

import { ChatService } from "./application/ChatService";
import { FileRepository } from "./infrastructure/repositories/FileRepository";
import { CurrencyController } from "./interfaces/controllers/ChatController";
import { setupSwagger } from "./interfaces/validations/Swagger";

export class Routes {
	private fileRepository: FileRepository;
	private chatService: ChatService;
	private chatController: CurrencyController;

	constructor() {
		this.fileRepository = new FileRepository();
		this.chatService = new ChatService(this.fileRepository);
		this.chatController = new CurrencyController(this.chatService);
	}

	public initialize(app: express.Application): void {
		app.use(express.json());
		app.get("/api/health", (_: express.Request, res: express.Response) => {
			res.status(200).json({ status: "ok" });
		});
		this.chatController.registerRoutes(app);
		setupSwagger(app);
	}
}
