import { addKeyword } from "@builderbot/bot";
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { config } from "~/config/config";
import { reset, start, stop } from "~/customs/idle-custom";

let limit = 0

export const mapFlow = addKeyword<Provider>('VER_NUESTRA_UBICACION')
    .addAnswer('Aqui tienes nuestra ubicación 🗺️')
    .addAnswer("https://www.google.com/maps/place/Universidad+Privada+del+Valle+Sede+La+Paz/@-16.5034609,-68.1199745,17z/data=!3m1!4b1!4m6!3m5!1s0x915f206782937445:0xacceb97486edb698!8m2!3d-16.5034609!4d-68.1199745!16s%2Fg%2F1hdzd_4wg?entry=ttu&g_ep=EgoyMDI1MDEwNi4xIKXMDSoASAFQAw%3D%3D", {delay: 1500})
    .addAction(async (ctx, { gotoFlow }) =>{
        limit = 0
        start(ctx, gotoFlow, config.time_limit_ms)
    })
    .addAnswer('Para volver escriba "*salir*"',
        {
            delay: 1000,
            capture: true
        },
        async (ctx, {endFlow, fallBack, gotoFlow}) => {
            if(ctx.body.toLowerCase() == "salir"){
                console.log("saliendo de mapa")
                limit = 0
                stop(ctx)
                return endFlow("*Terminando el proceso* 🏃‍♂️💨")
            }else{
                limit++
                if(limit > config.max_attempts){
                    limit = 0
                    stop(ctx)
                    return endFlow("*Limite de intentos excedido*, terminando el proceso")
                }
                reset(ctx, gotoFlow, config.time_limit_ms)
                console.log(limit)
                return fallBack("Ups 😮, se equivoco de palabras")
            }
        }
    )