FROM node:22
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install libcairo2-dev libjpeg-dev libgif-dev libpango1.0-dev -y
RUN npm install
CMD ["npm", "run", "start"]
EXPOSE 3000