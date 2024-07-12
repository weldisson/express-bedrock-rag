import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import type { Application } from "express";
import swaggerUi from "swagger-ui-express";
import type { ZodSchema } from "zod";
import { chatSchema } from "./Schemas";

const registry = new OpenAPIRegistry();

registry.register("chat_request_body", chatSchema);

const requestBody = (description: string, schema: ZodSchema) => {
	return {
		description,
		content: {
			"application/json": {
				schema,
			},
		},
	};
};

registry.registerPath({
	method: "get",
	path: "/api/health",
	summary: "Health check application",
	responses: {
		200: {
			description: "Object with user data.",
			content: {
				"application/json": {
					schema: {},
				},
			},
		},
	},
});

registry.registerPath({
	method: "post",
	path: "/api/chat/",
	summary: "Create Chat",
	request: {
		body: requestBody("Object to create a new chat", chatSchema),
	},
	responses: {
		200: {
			description: "",
			content: {
				"application/json": {
					schema: {},
				},
			},
		},
	},
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const setupSwagger = (app: Application) => {
	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(
			generator.generateDocument({
				openapi: "3.0.0",
				info: {
					version: "1.0.0",
					title: "ChatAI API",
					description: "An API for making a chat with AI.",
				},
			}),
		),
	);
};
