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
   // const authHeader = request.headers.authorization;
   const authHeader = 
   "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjI0N2Y4MDYwMDM5YjVmNDBkOTQ5NjkzOGJiMTg5NzA2ZWY4ODkzM2QiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiT3ppZWwgQ29zdGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSU1KN2VPS2R4MVJlU240cmItVjVRanFfekZrbGFlZFZZUlRsZFVwcWo2cVRGTjVBPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2RldmJpbGxzLWNsYXNzIiwiYXVkIjoiZGV2YmlsbHMtY2xhc3MiLCJhdXRoX3RpbWUiOjE3ODgyMjc3NDEsInVzZXJfaWQiOiJ3TmJmNDJlb2dRVUNMSlhDS09rZWpmUXlMeXYxIiwic3ViIjoid05iZjQyZW9nUVVDTEpYQ0tPa2VqZlF5THl2MSIsImlhdCI6MTc4ODY1Mzk3MSwiZXhwIjoxNzg4NjU3NTcxLCJlbWFpbCI6Im96aWVsMTk5MzIwMTZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDYxNTg2NzM2NzgwNjU3NDg4MDYiXSwiZW1haWwiOlsib3ppZWwxOTkzMjAxNkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.YxHIkGgJtWeSaZHvBONIyC0F3zdgsgXzczyKtntjeQVFCyP0IlTu2Och_i8N5wlhJWtOOSoelTcyAta4Q1jvfaPNTC35XZ2_0bC5xHVltLft7brL4_q1UvFqmqC-F8PpRQ2dJdaB8QmQn1ewBt-xXcLWRCW3QLnEvv2MSt5ZldZHzp5nHPoSoYvfkUi5OfY5p4jr5uhLhuD_ED8CpruLXTGR1xIBFKRHKNn7NQya-LEFNYYyaBezwa8m98VA5I0BPwyePRqfN4ZSUMH9BJ5DapDra83oB9XekzXNlBtkYJsP-yPvZZWnveMnPe1WJjTFbsOVeZ40gIDQ7MiqZCeHKQ"

   if(!authHeader || authHeader.startsWith("Bearer ")){
    reply.code(401).send({ error: "Token de autorização não fornecido" })
    return
   }
    

   const token = authHeader.replace("Beeare ", "")

   try {
    const decodedToken = await getAuth().verifyIdToken(token)

    request.userId = decodedToken.uid

   } catch (err) {
    request.log.error({ err }, "Erro ao verificar token")
    reply.code(401).send({ error: "Token invalido ou expirado"})
   }
};