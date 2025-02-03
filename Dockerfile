# Use the official Node.js image as the base image for building the application.
FROM node:21-alpine3.18 as builder

# Enable Corepack and prepare for PNPM installation
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Set environment variables
ENV TIME_LIMIT_MS=30000
ENV MAX_ATTEMPTS=5

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY package*.json pnpm-lock.yaml ./

# Install git for potential dependencies
RUN apk add --no-cache git

# Install PNPM dependencies
RUN pnpm install

# Copy the application source code into the container
COPY . .

RUN pnpm build

# Create a new stage for deployment
FROM builder as deploy

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files and directories for deployment
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --production

RUN pnpm add -g pm2

# Define the command to start the application using PM2 runtime
CMD ["pm2-runtime", "start", "./dist/app.js", "--cron", "0 */12 * * *"]
