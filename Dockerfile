FROM node:16-alpine
COPY . /opt/node-ircbot

RUN cd /opt/node-ircbot && yarn install --ignore-optional

VOLUME /opt/node-ircbot/config/
VOLUME /opt/node-ircbot/data/

USER nobody
CMD node --use_strict /opt/node-ircbot/main.js
