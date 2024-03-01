FROM node:21
RUN mkdir -p /home/src/api
WORKDIR /home/src/api
COPY package*.json .
RUN npm ci
COPY . .
EXPOSE 5000
CMD [ "npm", "run", "dev" ]
