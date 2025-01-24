import { addKeyword, EVENTS, createFlow, createProvider, MemoryDB, createBot } from '@builderbot/bot';
import { BaileysProvider } from '@builderbot/provider-baileys';
import dotenv from 'dotenv';

const products = [
    "- Planificación Estrategica",
    "- Social Media",
    "- Community Manager",
    "- SEM (Search Engine Marketing)",
    "- SEO (Optimización en motores de búsqueda)",
    "- CRO (Optimización de la tasa de conversión)",
    "- Automatizaciones y Diseño de Funnels (Correos masivos, embudos de venta)",
    "- Diseño Gráfico (Creación de identidades visuales, materiales gráficos)",
    "- Edición de Video Diseño Web (Páginas web a medida)",
    "- Diseño de Landing Pages Integracion de CRM ChatsBot IA"
];

const timers = {};
const idleFlow = addKeyword(EVENTS.ACTION).addAction(async (_, { endFlow }) => {
    return endFlow("Ha expirado el tiempo de respuesta, terminando el proceso");
});
const start = (ctx, gotoFlow, ms) => {
    timers[ctx.from] = setTimeout(() => {
        console.log(`User timeout: ${ctx.from}`);
        return gotoFlow(idleFlow);
    }, ms);
};
const reset = (ctx, gotoFlow, ms) => {
    stop(ctx);
    if (timers[ctx.from]) {
        console.log(`reset countdown for the user: ${ctx.from}`);
        clearTimeout(timers[ctx.from]);
    }
    start(ctx, gotoFlow, ms);
};
const stop = (ctx) => {
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
};

dotenv.config({ path: ".env.dev" });
const config = {
    port: Number(process.env.PORT) ?? 3008,
    time_limit_ms: Number(process.env.TIME_LIMIT_MS) ?? 60000,
    max_attempts: Number(process.env.MAX_ATTEMPTS) || 3
};

let limit$3 = 0;
const productsFlow = addKeyword('VER_LISTA_PRODUCTOS')
    .addAnswer('*Aqui esta nuestra lista de productos*')
    .addAnswer(products, { delay: 1500 })
    .addAction(async (ctx, { gotoFlow }) => {
    limit$3 = 0;
    start(ctx, gotoFlow, config.time_limit_ms);
})
    .addAnswer('Para volver escriba "*salir*"', {
    delay: 1000,
    capture: true
}, async (ctx, { endFlow, gotoFlow, fallBack }) => {
    if (ctx.body.toLowerCase() == "salir") {
        console.log("Saliendo del flujo de productos");
        limit$3 = 0;
        stop(ctx);
        return endFlow("*Terminando proceso* 🏃‍♂️💨");
    }
    else {
        limit$3++;
        console.log(limit$3);
        if (limit$3 > config.max_attempts) {
            limit$3 = 0;
            stop(ctx);
            return endFlow("*Limite de intentos excedido*, terminando el proceso");
        }
        reset(ctx, gotoFlow, config.time_limit_ms);
        return fallBack("Ups 😮, se equivoco de palabras");
    }
});

let limit$2 = 0;
const mapFlow = addKeyword('VER_NUESTRA_UBICACION')
    .addAnswer('Aqui tienes nuestra ubicación 🗺️')
    .addAnswer("https://www.google.com/maps/place/Universidad+Privada+del+Valle+Sede+La+Paz/@-16.5034609,-68.1199745,17z/data=!3m1!4b1!4m6!3m5!1s0x915f206782937445:0xacceb97486edb698!8m2!3d-16.5034609!4d-68.1199745!16s%2Fg%2F1hdzd_4wg?entry=ttu&g_ep=EgoyMDI1MDEwNi4xIKXMDSoASAFQAw%3D%3D", { delay: 1500 })
    .addAction(async (ctx, { gotoFlow }) => {
    limit$2 = 0;
    start(ctx, gotoFlow, config.time_limit_ms);
})
    .addAnswer('Para volver escriba "*salir*"', {
    delay: 1000,
    capture: true
}, async (ctx, { endFlow, fallBack, gotoFlow }) => {
    if (ctx.body.toLowerCase() == "salir") {
        console.log("saliendo de mapa");
        limit$2 = 0;
        stop(ctx);
        return endFlow("*Terminando el proceso* 🏃‍♂️💨");
    }
    else {
        limit$2++;
        if (limit$2 > config.max_attempts) {
            limit$2 = 0;
            stop(ctx);
            return endFlow("*Limite de intentos excedido*, terminando el proceso");
        }
        reset(ctx, gotoFlow, config.time_limit_ms);
        console.log(limit$2);
        return fallBack("Ups 😮, se equivoco de palabras");
    }
});

let limit$1 = 0;
const agentFlow = addKeyword('VER_AGENTE')
    .addAnswer('En un momento le atenderemos 🏃‍♂️...')
    .addAnswer('Para volver escriba "*salir*"', {
    delay: 1000,
    capture: true
}, async (ctx, { endFlow, fallBack }) => {
    if (ctx.body.toLowerCase() == "salir") {
        console.log("saliendo de agente");
        limit$1 = 0;
        return endFlow("*Volviendo al inicio* 🏃‍♂️💨");
    }
    else {
        limit$1++;
        console.log(limit$1);
        if (limit$1 > config.max_attempts) {
            limit$1 = 0;
            return endFlow("*Limite de intentos excedido*, terminando el proceso");
        }
        return fallBack("Ups 😮, se equivoco de palabras");
    }
});

const welcomeUserOptions = ['Hola', 'alo', 'ola', 'hola', 'oa', 'Buenas noches', 'Buenas tardes', 'buenas noches', 'buenas tardes'];

const port = config.port;
const limit_time = config.time_limit_ms;
let limit = 0;
const mainFlow = addKeyword(welcomeUserOptions)
    .addAction(async (ctx, { gotoFlow }) => {
    limit = 0;
    start(ctx, gotoFlow, limit_time);
})
    .addAnswer([
    '*Hola* 👋😊, bienvenido a nuestro chat',
    'Aqui te ofrecemos nuestro menu, por favor escriba unicamente el numero para elegir la opción 📃',
    '*1. Ver Productos*',
    '*2. Donde estamos*',
    '*3. Hablar con un agente*'
], { capture: true }, async (ctx, { gotoFlow, fallBack, endFlow }) => {
    switch (Number(ctx.body)) {
        case 1: {
            console.log("Entrando al flujo de productos");
            limit = 0;
            stop(ctx);
            return gotoFlow(productsFlow);
        }
        case 2: {
            console.log("Entrando al flujo del mapa");
            limit = 0;
            stop(ctx);
            return gotoFlow(mapFlow);
        }
        case 3: {
            console.log("Entrando al flujo del agente");
            limit = 0;
            stop(ctx);
            return gotoFlow(agentFlow);
        }
        default: {
            limit++;
            console.log("limit main: " + limit);
            if (limit > config.max_attempts) {
                limit = 0;
                stop(ctx);
                return endFlow("*Numero de intentos excedido*, Terminando el proceso");
            }
            reset(ctx, gotoFlow, limit_time);
            return fallBack("Ups 😮, no existe esta opción");
        }
    }
});
const main = async () => {
    const adapterFlow = createFlow([mainFlow, productsFlow, agentFlow, mapFlow, idleFlow]);
    const adapterProvider = createProvider(BaileysProvider);
    const adapterDB = new MemoryDB();
    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    httpServer(+port);
};
main();
