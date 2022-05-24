FROM node:16 AS build

WORKDIR /usr/voice
COPY package.json yarn.lock tsconfig.json ./
COPY prisma ./prisma/
RUN yarn
COPY src ./src
RUN yarn run build


FROM node:16

WORKDIR /usr/voice
COPY package.json yarn.lock ./

COPY --from=build /usr/voice/dist ./dist
COPY --from=build /usr/voice/node_modules ./node_modules

CMD ["yarn", "run", "start"]