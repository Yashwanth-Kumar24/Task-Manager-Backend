# Stage 1: Build the application
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production && \
    npm cache clean --force
COPY . .

# Stage 2: Smaller base image for the final stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/gateway.js ./gateway.js

ENV PORT=5000
EXPOSE 5000
CMD ["node", "gateway.js"]