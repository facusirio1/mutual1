import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Healthcheck
app.get("/health", (req, res) => res.json({ status: "ok", service: "ettios-vivienda-api" }));

// API
app.use("/api/v1", apiRouter);

// 404 + errores
app.use(notFound);
app.use(errorHandler);

export default app;
