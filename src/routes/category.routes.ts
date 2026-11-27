import type { FastifyInstance } from "fastify"
import { getCategories,  } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";




const categoryRoutes = async(fastify: FastifyInstance): Promise<void> => {
  fastify.addHook("onRequest", authMiddleware);

  fastify.get('/', getCategories)
   
};


export default categoryRoutes;


