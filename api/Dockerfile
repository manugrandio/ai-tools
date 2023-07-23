FROM node:18-alpine
ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --development

COPY . .

CMD ["npm", "run", "migration:run"]
CMD ["npm", "run", "start"]
