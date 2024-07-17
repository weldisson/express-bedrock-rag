import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import type { FilesRepositoryDomain } from "../../domain/FilesRepository";
import logger from "../../interfaces/helpers/Logger";
import FileModel from "../models/FileModel";
// Or, in web environments:
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// const blob = new Blob(); // e.g. from a file input
// const loader = new WebPDFLoader(blob);

export class FileRepository implements FilesRepositoryDomain {
  fileModel: FileModel;
  constructor() {
    this.fileModel = new FileModel();
  }

  async readFile(filePath: string): Promise<string> {
    try {
      if (filePath === "") throw new Error("filePath could not be empty");

      const loader = new PDFLoader(filePath);

      const docs = await loader.load();
      logger.info(docs[0].pageContent);
      return docs[0].pageContent;
    } catch (error) {
      throw new Error("Failed to read file");
    }
  }
}
