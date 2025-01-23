FROM node:22.13.1-slim
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]

