FROM node:14-alpine
COPY . /opt/node-ircbot

RUN cd /opt/node-ircbot && yarn install --ignore-optional

VOLUME /opt/node-ircbot/config/
VOLUME /opt/node-ircbot/data/

USER nobody
CMD /usr/bin/nodejs --use_strict /opt/node-ircbot/main.js --config /opt/node-ircbot/config/service.js
