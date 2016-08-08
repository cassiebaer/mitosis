FROM docker
#
# Install project dependencies
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/package.json

RUN apk add --update bash coreutils ncurses tar gzip nodejs \
  && touch ~/.bashrc \
  && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | sh \
  && LINE=$(cat /root/.nvm/nvm.sh | grep -in '{BASH_SOURCE\[0\]}' | awk -F: '{print $1}') \
  && sed -i "${LINE}s/BASH_SOURCE\[0\]\}/BASH_SOURCE\}\$\{0\}/" /root/.nvm/nvm.sh \
  && source ~/.bashrc \
  && nvm ls \
  && nvm install node \
  && nvm use --delete-prefix v6.3.1 \
  && npm install

EXPOSE 80
