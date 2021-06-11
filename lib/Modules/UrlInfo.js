'use strict';

const entities = require('html-entities')
const commons = require('../Utils/Common');
const request = require('request');

const MAX_TITLE_LENGTH = 100;
const MAX_BODY_SIZE = 100 * 1024;

class UrlInfo {

    constructor() {
        this.regex = new RegExp('(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:;,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:;,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:;,.]*\)|[A-Z0-9+&@#\/%=~_|$])', 'igm')
    }
    setup(irc) {
        this.irc = irc;
        this.irc.onMessage(this.onMessage.bind(this));
    }

    onMessage(channel, nickname, message, isQuery) {

        if (isQuery) {
            return false;
        }

        const m = message.match(this.regex);
        if (m) {
            m.forEach((url) => {
                this.retrieveTitle(url, (error, title) => {

                    if (error) {
                        return false;
                    }

                    this.irc.say('UrlInfo: ' + title);
                });
            });
        }
    }

    retrieveTitle(url, callback) {
        url = UrlInfo.sanitizeUrl(url);

        let body = '';
        const req = request.get(url, (error, response, body) => {
            if (error) {
                return callback(error);
            }
        });

        req.on('response', function(response) {
            const statusCode = response.statusCode;
            const contentType = response.headers['content-type'];

            let error = null;
            if (statusCode !== 200) {
                error = new Error('Status-Code: ' + statusCode);
            } else if (!/^text\/html/.test(contentType)) {
                error = new Error('Content-Type: ' + contentType);
            }

            if (error) {
                req.abort();
                return callback(error);
            }
        });

        req.on('data', (data) => {
            body += data;

            if (body.length > MAX_BODY_SIZE || body.indexOf('</title>') !== -1) {
                req.abort();
            }
        });

        req.on('end', () => {
            if (!body) {
                return callback(new Error('Body is empty'));
            }

            const m = body.match(/<title>([^<]+)<\/title>/);
            if (!m) {
                return callback(new Error('Can\'t find title'));
            }

            let title = entities.decode(m[1]);
            title = title.replace(/\s+/g, ' ').trim();

            return callback(null, commons.ellipsis(title, MAX_TITLE_LENGTH));
        });
    }

    static sanitizeUrl(url) {
        if (!url.match(/^https?:\/\//)) {
            return 'http://' + url;
        }

        return url;
    }

}

module.exports = UrlInfo;
