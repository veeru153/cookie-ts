FROM node:18
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install libcairo2-dev libjpeg-dev libgif-dev libpango1.0-dev -y
RUN yarn install
CMD ["yarn", "start"]
EXPOSE 3000