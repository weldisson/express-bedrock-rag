import { chatSchema } from "./Schemas";

describe("Schemas", () => {
	describe("chatSchema", () => {
		it("Should pass with correct data", () => {
			const data = {
				content: "Who invented the light bulb?",
			};

			expect(chatSchema.safeParse(data).success).toBe(true);
		});

		it("'content' is invalid", () => {
			const invalidData = {};

			const result = chatSchema.safeParse(invalidData);
			expect(result.error?.errors[0].code).toBe("invalid_type");
			expect(result.error?.errors[0].message).toBe("Required");
			expect(result.error?.errors[0].path[0]).toBe("content");
		});
		it("'content' is not string", () => {
			const invalidData = { content: 1 };
			const result = chatSchema.safeParse(invalidData);
			expect(result.error?.errors[0].message).toBe(
				"Expected string, received number",
			);
			expect(result.error?.errors[0].path[0]).toBe("content");
		});
	});
});
