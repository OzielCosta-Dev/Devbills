import type { FastifyReply, FastifyRequest } from "fastify"
import { createTransactionSchema, type CreateTransactionSchema } from "../../schemas/transactions.schema.js";
import { error } from "node:console";
import prisma from "../../config/prisma.js";



const createTransaction = async (
  request:FastifyRequest<{Querystring: CreateTransactionSchema}>, 
  reply: FastifyReply): Promise<void> => {
      const userId = "FED$%DF%RDF"

      if(!userId){
         reply.status(401).send({ error: "Usuário não autenticado"})
         return;
      }

      const result = createTransactionSchema.safeParse(request.body);

      if(!result.success) {
          const errorMessage = result.error.message || "Validação inválida";
          return reply.status(400).send({ error : errorMessage });
      }


      const transaction = result.data;

      try {
        
        const category = await prisma.category.findFirst({ 
          where: {
            id: transaction.categoryId,
            type: transaction.type,
          },
        });

        if(!category) {
          reply.status(400).send({ error : "Categoria inválida"});
          return;
        }

        const parseDate = new Date(transaction.date);


        const newTransaction = await prisma.transaction.create({
          data:{
            ...transaction,
            userId,
            date: parseDate,
          },
          include: {
            Category: true,
          },
        });

        reply.status(201).send(newTransaction);

      } catch (error) {
        request.log.error({error},"Erro ao criar transação")
        reply.status(500).send({ error: "Erro interno do Servidor"})
      }
};



export default createTransaction;