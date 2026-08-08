import { z } from "zod";
import fastify from "fastify";
import { type FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller.js";
import { createTransactionSchema, deleteTransactionSchema, getTransactionsSchema, getTransactionsSummarySchema } from "../schemas/transactions.schema.js";
import { getTransactions } from "../controllers/transactions/getTransactions.controller.js";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller.js";
import { getCategories } from "../controllers/category.controller.js";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller.js";



const transactionRoutes = async(fastify: FastifyInstance) => {
    
   // Criação
   fastify.route({
       method: "POST",
       url:"/",
       schema: {
           body: z.toJSONSchema(createTransactionSchema, { target: "draft-7" }),
       },
       handler: createTransaction,
   });
   
   //Buscar com Filtros
   fastify.route({
    method: "GET",
    url: "/",
    schema: {
        querystring: z.toJSONSchema(getTransactionsSchema, { target: "draft-7" }),
    },
    handler: getTransactions,
   });


    //Buscar o resumo 
    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: z.toJSONSchema(getTransactionsSummarySchema, { target: "draft-7" }),
        },
        handler:getTransactionsSummary,
    });

   // Deletar
    fastify.route({
      method: "DELETE",
      url: "/:id",
      schema: {
        params:  z.toJSONSchema(deleteTransactionSchema, { target: "draft-7" }),
      },
      handler: deleteTransaction,
    });
      
    };

export default transactionRoutes;