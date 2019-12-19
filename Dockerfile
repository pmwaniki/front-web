FROM node:8

ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /usr/src/app/
#Install serve
RUN npm install -g serve
CMD serve -s build
EXPOSE 5000

# Install all depedencies
COPY package.json package.json
RUN npm install

COPY . .

#build for production
RUN npm run build