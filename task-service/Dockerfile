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
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/models ./models
COPY --from=build /app/app.js ./app.js
COPY --from=build /app/controller ./controller

ARG MONGO_URI

ENV MONGO_URI=$MONGO_URI
ENV TASK_SERVICE_PORT=5002

EXPOSE 5002
CMD ["node", "server.js"]