import { addKeyword } from "@builderbot/bot";
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { config } from "~/config/config";

let limit = 0
export const agentFlow = addKeyword<Provider>('VER_AGENTE')
    .addAnswer('En un momento le atenderemos 🏃‍♂️...')
    .addAnswer('Para volver escriba "*salir*"',
        {
            delay: 1000,
            capture: true
        },
        async (ctx, {endFlow, fallBack}) => {
            if(ctx.body.toLowerCase() == "salir"){
                console.log("saliendo de agente")
                limit = 0
                return endFlow("*Volviendo al inicio* 🏃‍♂️💨")
            }else{
                limit++
                console.log(limit)
                if(limit > config.max_attempts){
                    limit = 0
                    return endFlow("*Limite de intentos excedido*, terminando el proceso")
                }
                return fallBack("Ups 😮, se equivoco de palabras")
            }
        }
    )