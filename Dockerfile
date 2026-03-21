FROM node:20

WORKDIR /app

# clean install (important)
COPY package*.json ./
RUN npm ci

COPY . .

# build-time env
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]