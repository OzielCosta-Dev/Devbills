import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsQuery } from "../../schemas/transactions.schema.js";
import type { TransactionFilters } from "../../types/transaction.types.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"
import prisma from "../../config/prisma.js";

dayjs.extend(utc);

export const getTransactions = async(
    request: FastifyRequest<{Querystring: GetTransactionsQuery }>, 
    reply: FastifyReply
): Promise<void> => {
    const userId = request.userId; 

       if(!userId){
         reply.status(401).send({ error: "Usuário não autenticado"})
         return;
      }

    const { month, categoryId, year, type } = request.query;

    const filters:TransactionFilters = { userId };

    if(month && year){
        const starDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = dayjs.utc(starDate).endOf('month').toDate();
        filters.date = { gte: starDate, lte: endDate };
    }

    if(type){
        filters.type = type
    }

    if(categoryId){
        filters.categoryId = categoryId;
    }

    try {
    const transactions = await prisma.transaction.findMany({
        where: filters,
        orderBy: {date: 'desc'},
        include: {
            Category: {
                select: {
                    color: true,
                    name: true,
                    type: true,
                }
            }
        }
    })
      reply.send(transactions)
    } catch(err){
      request.log.error({err},"Erro ao trazer transações")
      reply.status(500).send({error: "Erro do servidor"})
    }
};



