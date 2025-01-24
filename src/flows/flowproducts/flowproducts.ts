import { addKeyword } from "@builderbot/bot";
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { products } from "~/constants/products";
import { reset, start, stop } from "~/customs/idle-custom";
import { config } from "~/config/config";

let limit = 0

export const productsFlow = addKeyword<Provider>('VER_LISTA_PRODUCTOS')
    .addAnswer('*Aqui esta nuestra lista de productos*')
    .addAnswer(products, {delay: 1500})
    .addAction(async(ctx, {gotoFlow}) =>{
        limit = 0 
        start(ctx, gotoFlow, config.time_limit_ms)
    })
    .addAnswer('Para volver escriba "*salir*"',
        {
            delay: 1000,
            capture: true
        },
        async (ctx, {endFlow, gotoFlow, fallBack}) => {
            if(ctx.body.toLowerCase() == "salir"){
                console.log("Saliendo del flujo de productos")
                limit = 0
                stop(ctx)
                return endFlow("*Terminando proceso* 🏃‍♂️💨")
            }else{
                limit++
                console.log(limit)
                if(limit > config.max_attempts){
                    limit = 0
                    stop(ctx)
                    return endFlow("*Limite de intentos excedido*, terminando el proceso")
                }
                reset(ctx, gotoFlow, config.time_limit_ms)
                return fallBack("Ups 😮, se equivoco de palabras")
            }
        }
    )