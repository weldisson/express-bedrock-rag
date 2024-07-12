import type { FilesRepositoryDomain } from "../../domain/FilesRepository";
import FileModel from "../models/FileModel";
export class FileRepository implements FilesRepositoryDomain {
	fileModel: FileModel;
	constructor() {
		this.fileModel = new FileModel();
	}
	async getFiles() {
		await this.fileModel.findAll();
	}
}
