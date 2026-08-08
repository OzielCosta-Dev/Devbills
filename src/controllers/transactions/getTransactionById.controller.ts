import type { FastifyReply, FastifyRequest } from "fastify";
import type { DeleteTransactionParams } from "../../schemas/transactions.schema.js";
import prisma from "../../config/prisma.js";

export const getTransactionById = async(
    request: FastifyRequest<{ Params: DeleteTransactionParams }>,
    reply: FastifyReply
): Promise<void> => {

    const userId = "FED$%DF%RDF"
    const { id } = request.params

    if(!userId){
        reply.status(401).send({ error: "Usuário não autenticado"})
        return;
    }

    try {
        const transaction = await prisma.transaction.findFirst({
            where: { id, userId },
            include: {
                Category: {
                    select: {
                        color: true,
                        name: true,
                        type: true,
                    }
                }
            }
        });

        if(!transaction){
            reply.status(404).send({error: "Transação não encontrada"});
            return;
        }

        reply.send(transaction)
    } catch(err){
        request.log.error({err},"Erro ao buscar transação")
        reply.status(500).send({error: "Erro do servidor"})
    }
}
