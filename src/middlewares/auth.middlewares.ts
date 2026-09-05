import type { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

export const authMiddleware = async(request: FastifyRequest,  reply: FastifyReply): Promise<void> => {

    const authHeader = request.headers.authorization
    
}