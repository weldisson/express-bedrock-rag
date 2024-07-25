import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const chatSchema = z
  .object({
    content: z.string().min(1).openapi({
      description: "message to send on chat",
      example: "Lorem ipsum",
    }),
  })
  .openapi({ description: "Schema for chat generate" });
