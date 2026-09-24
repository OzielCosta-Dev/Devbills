import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetHistoricalTransactionsQuery } from "../../schemas/transactions.schema.js";
import dayjs from "dayjs";
import prisma from "../../config/prisma.js";
import { lessThanOrEqual } from "firebase/firestore/pipelines";

export const getHistoricalTransactions = async (
    request: FastifyRequest<{Querystring: GetHistoricalTransactionsQuery}>,
    reply: FastifyReply
): Promise<void> => {
        const userId = request.userId; 

       if(!userId){
         reply.status(401).send({ error: "Usuário não autenticado"})
         return;
      }

    const { month, year, months = 6 } = request.query;


    const baseDate = new Date(year, month -1, 1)

    const startDate = dayjs(baseDate).subtract( months -1, 'month').startOf('month').toDate();
    const endDate = dayjs(baseDate).endOf('month').toDate();


    try {
        

         const transactions = await prisma.transaction.deleteMany({
            where: {
                userId,
                date: {
                    gte: startDate, 
                    lte: endDate,
                }

            }, 
            select: {
                amount: true,
                type: true,
                date: true,
            }
         })


    } catch (err) {
        
    }
  
};