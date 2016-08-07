FROM docker

# Install project dependencies
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/package.json

# Install Node and project deps.
RUN apk add --update bash \
  && touch /root/.bashrc \
  && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash \
  && source /root/.bashrc \
  && nvm install node \
  && npm install

CMD echo foo

EXPOSE 80
