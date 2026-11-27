import type { FastifyInstance } from "fastify";
import { z } from "zod";
import createTransaction from "../controllers/transactions/createTransaction.controller.js";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller.js";
import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransactions.controler.js";
import { getTransactionById } from "../controllers/transactions/getTransactionById.controller.js";
import { getTransactions } from "../controllers/transactions/getTransactions.controller.js";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller.js";
import { updateTransaction } from "../controllers/transactions/updateTransaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import {
	createTransactionSchema,
	getHistoricalTransactionsSchema,
	getTransactionsSchema,
	getTransactionsSummarySchema,
	transactionIdSchema,
	updateTransactionSchema,
} from "../schemas/transactions.schema.js";

const toSchema = (schema: z.ZodType) =>
	z.toJSONSchema(schema, { target: "draft-7" });

const transactionRoutes = async (fastify: FastifyInstance): Promise<void> => {
	fastify.addHook("onRequest", authMiddleware);

	// Criação
	fastify.route({
		method: "POST",
		url: "/",
		schema: { body: toSchema(createTransactionSchema) },
		handler: createTransaction,
	});

	// Buscar com filtros
	fastify.route({
		method: "GET",
		url: "/",
		schema: { querystring: toSchema(getTransactionsSchema) },
		handler: getTransactions,
	});

	// Resumo do mês
	fastify.route({
		method: "GET",
		url: "/summary",
		schema: { querystring: toSchema(getTransactionsSummarySchema) },
		handler: getTransactionsSummary,
	});

	// Histórico mensal
	fastify.route({
		method: "GET",
		url: "/historical",
		schema: { querystring: toSchema(getHistoricalTransactionsSchema) },
		handler: getHistoricalTransactions,
	});

	// Buscar por ID
	fastify.route({
		method: "GET",
		url: "/:id",
		schema: { params: toSchema(transactionIdSchema) },
		handler: getTransactionById,
	});

	// Atualizar
	fastify.route({
		method: "PUT",
		url: "/:id",
		schema: {
			params: toSchema(transactionIdSchema),
			body: toSchema(updateTransactionSchema),
		},
		handler: updateTransaction,
	});

	// Deletar
	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: { params: toSchema(transactionIdSchema) },
		handler: deleteTransaction,
	});
};

export default transactionRoutes;
