import { z } from "zod";
import { ObjectId } from "mongodb";
import { TransactionType } from "@prisma/client";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id); 

export const createTransactionSchema = z.object({
    description: z.string().min(1, "Descrição obrigatória"),
    amount: z.number().positive("valor deve ser positivo"),
    date: z.string({
        message: "Data inválida", // Em vez de errorMap
}),
    categoryId: z.string().refine(isValidObjectId, {
        message:"Categoria inválida",
    }),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        message: "Data inválida",

    })
});

export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        message: "Data inválida",
    }).optional(),
    categoryId: z
    .string()
    .refine(isValidObjectId, {
        message:"Categoria inválida",
    }).optional(),
})

export const getTransactionsSummarySchema = z.object({
    month: z.string({message: "O mês é obrigatório"}),
    year: z.string({message: "O ano é obrigatório"}),
})

export const deleteTransactionSchema = z.object({
    id:  z.string().refine(isValidObjectId, {
        message:"ID inválido",
    }),
})

export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSchema>;

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>

export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>
