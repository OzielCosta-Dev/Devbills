import app from './app.js'

const PORT = 3001

const startServer = async () => {

    try{
        await app.listen({ port: PORT}).then( () => {
            console.log(`Servidor rodando na porta ${PORT}`)
        })

    } catch(err){
        console.error(err)
    }
}

startServer()