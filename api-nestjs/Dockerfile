FROM node:20.16.0-alpine
WORKDIR /app

COPY package*.json ./ 
RUN npm install

COPY . .

RUN npx prisma migrate dev
RUN npx prisma db push

EXPOSE 3030

CMD ["npm", "run", "start:dev"]
