import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { env } from "./config/env.js";
import routes from "./routes/index.js";

const app: FastifyInstance = Fastify({
	logger: {
		level: env.NODE_ENV === "dev" ? "info" : "error",
	},
});

app.register(cors, {
	origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",").map((o) => o.trim()) : true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(routes, { prefix: "/api" });

export default app;
