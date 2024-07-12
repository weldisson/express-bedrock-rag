import type { FilesRepositoryDomain } from "../domain/FilesRepository";
import logger from "../interfaces/helpers/Logger";

export class ChatService {
	constructor(private fileRepository: FilesRepositoryDomain) {}

	async create(content: string): Promise<string> {
		// TODO
		logger.info("content is ", content);
		await this.fileRepository.getFiles();
		return "hello word!";
	}
}
