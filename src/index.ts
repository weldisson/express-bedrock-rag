import "dotenv/config";
import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Routes } from "./Routes";
import logger from "./interfaces/helpers/Logger";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "../public")));
const routes = new Routes();
routes.initialize(app);
app.disable("x-powered-by");

app.listen(port, () => {
	logger.info(`API listening at http://localhost:${port}`);
});

export default app;
