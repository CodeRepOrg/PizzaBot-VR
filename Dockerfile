FROM node:lts-alpine

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

ENV APIKEY=
ENV ASSISTANTID=
ENV URL=
ENV VR_APIKEY=
ENV VR_URL=
ENV VR_CLASSIFIER=

CMD ["npm", "start"]