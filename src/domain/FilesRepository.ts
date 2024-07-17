export interface FilesRepositoryDomain {
	readFile(filePath: string): Promise<string>;
}
