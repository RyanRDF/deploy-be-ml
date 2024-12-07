FROM node:16
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV APP_ENV=production
ENV APP_PORT=8080
ENV MODEL_URL="https://storage.googleapis.com/ml-model-bucket-ryanrafael/submissions-model/model.json"
ENV PROJECT_ID="submissionmlgc-ryanrafael"

CMD [ "npm", "start" ]

EXPOSE 8080