import { extname } from "node:path";
import type { Readable } from "node:stream";
import type express from "express";
import multer, { type FileFilterCallback } from "multer";
import type { ChatService } from "../../application/ChatService";
import logger from "../helpers/Logger";
import { chatSchema } from "../validations/Schemas";
import { validate } from "../validations/Validate";

const storage = multer.diskStorage({
	destination: (_, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (_, file, cb) => {
		cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (
		req: express.Request,
		file: Express.Multer.File,
		cb: FileFilterCallback,
	) => {
		if (file.mimetype === "application/pdf") {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type. Only PDF files are allowed."));
		}
	},
});

export class CurrencyController {
	constructor(private chatService: ChatService) {}

	registerRoutes(app: express.Application) {
		app.post("/api/chat", validate(chatSchema), this.chatHandler.bind(this));
		app.post(
			"/api/upload",
			upload.single("file"),
			this.addFileHandler.bind(this),
		);
	}

	async chatHandler(req: express.Request, res: express.Response) {
		try {
			const { content } = req.body;
			logger.info("Starting message");
			const stream = await this.chatService.create(content);

			res.writeHead(200, {
				"Content-Type": "text/plain; charset=utf-8",
			});
			stream.on("data", (chunk: Readable) => {
				res.write(chunk);
			});

			stream.on("end", () => {
				res.end();
			});
		} catch (error) {
			logger.error(`Error: ${error}`);
			res.status(400).json({
				statusCode: 400,
				message: (error as Error).message,
			});
		}
	}

	async addFileHandler(req: express.Request, res: express.Response) {
		try {
			if (!req.file) {
				throw new Error("No file uploaded");
			}
			const filePath = req.file.path;

			await this.chatService.addFile(filePath);

			res.status(200).json({ success: true });
		} catch (error) {
			logger.error(`Error: ${error}`);
			res.status(400).json({
				statusCode: 400,
				message: (error as Error).message,
			});
		}
	}
}
