import type { FastifyInstance } from "fastify"
import categoryRoutes from "./category.routes.js"

async function routes(fastify: FastifyInstance): Promise<void>{

    fastify.get('/health', async() => {
        return {
            status: 'Ok',
            message: 'DevBills API rodando normalmente'
        }
    })

    fastify.register(categoryRoutes, { prefix: '/categories'})

}

export default routes