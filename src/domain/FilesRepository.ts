import type { Document, DocumentInterface } from "@langchain/core/documents";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Metadata = Record<string, any>;
export interface FilesRepositoryDomain {
  readFiles(filePath: string): Promise<Document[]>;
  addDocuments(
    docs: Array<{ pageContent: string; metadata: Metadata; vector: number[] }>
  ): Promise<void>;
  similaritySearch(term: string): Promise<DocumentInterface[]>;
}
