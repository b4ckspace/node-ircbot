var Entities = require('html-entities').AllHtmlEntities;
var request = require('request');

const MAX_TITLE_LENGTH = 100;
const MAX_BODY_SIZE = 100 * 1024;


class UrlInfo {

    constructor() {
        this.entities = new Entities();
        this.regex = new RegExp('(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])', 'igm');
    }
    setup(irc) {
        this.irc = irc;
        this.irc.onMessage(this.onMessage.bind(this));
    }

    onMessage(channel, nickname, message, isQuery) {

        if (isQuery) {
            return false;
        }

        var m = message.match(this.regex);
        if (m) {
            m.forEach((url) => {
                this.retrieveTitle(url, (error, title) => {

                    if (error) {
                        return false;
                    }

                    this.irc.say(title);
                });
            });
        }
    }

    retrieveTitle(url, callback) {
        url = this.validateUrl(url);

        var body = '';
        var r = request.get(url, (error, response, body) => {
            if (error) {
                return callback(error);
            }
        });

        r.on('data', (data) => {
            body += data;

            if (body.length > MAX_BODY_SIZE || body.indexOf('</title>') !== -1) {
                r.abort();
            }
        });

        r.on('end', () => {
           if (!body) {
               return callback(new Error('Body is empty'));
           }

           var m = body.match(/<title>([^<]+)<\/title>/);
           if (!m) {
               return callback(new Error('Can\'t find title'));
           }

           var title = this.entities.decode(m[1]);
           return callback(null, this.limitTitle(title));
        });
    }

    validateUrl(url) {
        if (!url.match(/^https?:\/\//)) {
            return 'http://' + url;
        }

        return url;
    }

    limitTitle(title) {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH - 3) + '...';
        }

        return title;
    }

}

module.exports = UrlInfo;