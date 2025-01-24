import { EVENTS, addKeyword } from '@builderbot/bot'
import { BotContext, TFlow } from '@builderbot/bot/dist/types';

const timers = {};

const idleFlow = addKeyword(EVENTS.ACTION).addAction(
    async (_, { endFlow }) => {
        return endFlow("Ha expirado el tiempo de respuesta, terminando el proceso");
    }
);

const start = (ctx: BotContext, gotoFlow: (a: TFlow) => Promise<void>, ms: number) => {
    timers[ctx.from] = setTimeout(() => {
        console.log(`User timeout: ${ctx.from}`);
        return gotoFlow(idleFlow);
    }, ms);
}

const reset = (ctx: BotContext, gotoFlow: (a: TFlow) => Promise<void>, ms: number) => {
    stop(ctx);
    if (timers[ctx.from]) {
        console.log(`reset countdown for the user: ${ctx.from}`);
        clearTimeout(timers[ctx.from]);
    }
    start(ctx, gotoFlow, ms);
}

const stop = (ctx: BotContext) => {
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
}

export {
    start,
    reset,
    stop,
    idleFlow,
}
