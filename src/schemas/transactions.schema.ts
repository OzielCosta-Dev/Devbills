import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

const transactionTypeSchema = z.enum(
	[TransactionType.expense, TransactionType.income],
	{ message: "Tipo de transação inválido" },
);

export const createTransactionSchema = z.object({
	description: z
		.string({ message: "Descrição obrigatória" })
		.trim()
		.min(1, "Descrição obrigatória")
		.max(120, "Descrição deve ter no máximo 120 caracteres"),
	amount: z
		.number({ message: "Valor inválido" })
		.positive("Valor deve ser positivo"),
	date: z.string({ message: "Data inválida" }).min(1, "Data inválida"),
	categoryId: z.string().refine(isValidObjectId, {
		message: "Categoria inválida",
	}),
	type: transactionTypeSchema,
});

export const updateTransactionSchema = createTransactionSchema;

export const getTransactionsSchema = z.object({
	month: z.string().optional(),
	year: z.string().optional(),
	type: transactionTypeSchema.optional(),
	categoryId: z
		.string()
		.refine(isValidObjectId, { message: "Categoria inválida" })
		.optional(),
});

export const getTransactionsSummarySchema = z.object({
	month: z.string({ message: "O mês é obrigatório" }),
	year: z.string({ message: "O ano é obrigatório" }),
});

export const getHistoricalTransactionsSchema = z.object({
	month: z.coerce.number().min(1).max(12),
	year: z.coerce.number().min(2000).max(2100),
	months: z.coerce.number().min(1).max(12).optional(),
});

export const transactionIdSchema = z.object({
	id: z.string().refine(isValidObjectId, { message: "ID inválido" }),
});

/** @deprecated use transactionIdSchema */
export const deleteTransactionSchema = transactionIdSchema;

export type GetHistoricalTransactionsQuery = z.infer<
	typeof getHistoricalTransactionsSchema
>;
export type GetTransactionsSummaryQuery = z.infer<
	typeof getTransactionsSummarySchema
>;
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type TransactionIdParams = z.infer<typeof transactionIdSchema>;
export type DeleteTransactionParams = TransactionIdParams;
