FROM node:18

WORKDIR /srv/http/abi-website

COPY package*.json ./

RUN npm install

COPY api ./api/
COPY assets ./assets/
COPY backend ./backend/
COPY components ./components/
COPY lib ./lib/
COPY mails ./mails/
COPY media ./media/
COPY models ./models/
COPY pages ./pages/
COPY public ./public/
COPY app.vue env.d.ts backend.ts frontend.ts index.html tsconfig.json vite.config.ts ./

RUN npm run build

ENV PORT=4000
EXPOSE 4000

CMD [ "npm", "run", "serve" ]
