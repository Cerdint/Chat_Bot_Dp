import dotenv from 'dotenv'

dotenv.config({path: ".env"})


export const config = {
    port: Number(process.env.PORT) ?? 3008,
    time_limit_ms: Number(process.env.TIME_LIMIT_MS) ?? 60000,
    max_attempts: Number(process.env.MAX_ATTEMPTS) || 3
}