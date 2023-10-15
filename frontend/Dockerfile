FROM node:alpine

WORKDIR /app/frontend

COPY . .
RUN npm install --force

EXPOSE 3000
CMD npm run dev 