import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string
    }
}

export const authMiddleware = async(
    request: FastifyRequest,  
    reply: FastifyReply,
): Promise<void> => {
   const authHeader = request.headers.authorization;

   if(!authHeader || !authHeader.startsWith("Bearer ")){
    reply.code(401).send({ error: "Token de autorização não fornecido" })
    return
   }
    

   const token = authHeader.replace("Bearer ", "")

   try {
    const decodedToken = await getAuth().verifyIdToken(token)

    request.userId = decodedToken.uid

   } catch (err) {
    request.log.error({ err }, "Erro ao verificar token")
    reply.code(401).send({ error: "Token invalido ou expirado"})
   }
};