FROM node:alpine
WORKDIR /app 
copy package.json ./
RUN yarn install 
COPY ./ ./

CMD ["yarn", "start"]