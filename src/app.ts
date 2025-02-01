import { createBot, createProvider, createFlow, addKeyword} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { productsFlow } from './flows/flowproducts/flowproducts'
import { mapFlow } from './flows/flowmap/flowmap'
import { agentFlow } from './flows/flowagent/flowagent'
import { welcomeUserOptions } from './constants/useroptions'
import { reset, start, stop, idleFlow } from './customs/idle-custom'
import { config } from './config/config'

const port = config.port
const limit_time = config.time_limit_ms
let limit = 0

const mainFlow = addKeyword<Provider>(welcomeUserOptions as [string, ...string[]])
    .addAction(async (ctx, { gotoFlow }) =>{
        limit = 0
        start(ctx, gotoFlow, limit_time)
    })
    .addAnswer([
        '*Hola* 👋😊, bienvenido a nuestro chat',
        'Aqui te ofrecemos nuestro menu, por favor escriba unicamente el numero para elegir la opción 📃',
        '*1. Ver Productos*',
        '*2. Donde estamos*',
        '*3. Hablar con un agente*'
    ],
    { capture: true },
    async ( ctx, {gotoFlow, fallBack, endFlow}) =>{
        switch(Number(ctx.body)){
            case 1:{
                console.log("Entrando al flujo de productos")
                limit = 0
                stop(ctx)
                return gotoFlow(productsFlow)
            }
            case 2:{
                console.log("Entrando al flujo del mapa")
                limit = 0
                stop(ctx)
                return gotoFlow(mapFlow)
            }
            case 3: {
                console.log("Entrando al flujo del agente")
                limit = 0
                stop(ctx)
                return gotoFlow(agentFlow)
            }
            default:{
                limit++
                console.log("limit main: "+limit)
                if(limit > config.max_attempts){
                    limit = 0
                    stop(ctx)
                    return endFlow("*Numero de intentos excedido*, Terminando el proceso")
                }
                reset(ctx, gotoFlow, limit_time)
                return fallBack("Ups 😮, no existe esta opción")
            }
        }
    }
)

const main = async () => {
    const adapterFlow = createFlow([mainFlow, productsFlow, agentFlow, mapFlow, idleFlow])
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    httpServer(+port)
}

main()
