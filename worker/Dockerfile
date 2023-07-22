FROM node:18-alpine
ENV NODE_ENV=development

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --development

COPY . .

CMD ["npm", "run", "start"]
