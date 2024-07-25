import { Readable } from "node:stream";
import type { IterableReadableStream } from "@langchain/core/dist/utils/stream";
import type { AIMessageChunk } from "@langchain/core/messages";

export class Helpers {
	iterableToStream(iterable: IterableReadableStream<AIMessageChunk>): Readable {
		const iterator = iterable[Symbol.asyncIterator]();
		return new Readable({
			async read() {
				const { value, done } = await iterator.next();
				if (done) {
					this.push(null);
				} else {
					this.push(value.content || "");
				}
			},
		});
	}
}
