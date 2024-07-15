export interface FilesRepositoryDomain {
	getFiles(): Promise<void>; //todo type
	readFile(): Promise<void>; //todo type
}
