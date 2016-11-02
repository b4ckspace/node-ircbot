var commons = require('../Utils/Common');

const REGEX_KARMA_INCREMENT = /^([^\s:+]+)(:|\s)*(\+\+|\+1)/;

function Karma(karma) {
    this.karma = karma;
}

Karma.prototype.setup = function(irc) {
    this.irc = irc;

    this.irc.onCommand('karma', this.onKarma.bind(this));
    this.irc.onCommand('karmatop', this.onKarmaTop.bind(this));

    this.irc.onMessage(this.onMessage.bind(this));
};

Karma.prototype.onKarma = function(channel, nickname, command, payload) {
    var karma = this.karma.getKarma(nickname);

    if(payload) {
        karma = this.karma.getKarma(payload);
        this.irc.answer(channel, nickname, payload + ': ' + karma);
    } else {
        this.irc.answer(channel, nickname, 'You have ' + karma + ' karma.');
    }
};

Karma.prototype.onKarmaTop = function(channel, nickname, command, payload) {

    var limit = 3;
    if(payload) {
        limit = Math.min(parseInt(payload, 10), 10);
    }

    var that = this;
    var top = this.karma.getTop(limit).map(function(nickname) {
        return commons.avoidHighlighting(nickname) + ': ' + that.karma.getKarma(nickname);
    });

    this.irc.answer(channel, nickname, top.join(', '));
};

Karma.prototype.onMessage = function(channel, nickname, message, isQuery) {

    var matches = message.match(REGEX_KARMA_INCREMENT);
    if(matches) {
        var favoredNickname = matches[1];

        if(isQuery) {
            return this.irc.answer(nickname, nickname, 'You can only give karma in the channel');
        }

        if(commons.sanitizeNickname(nickname) == commons.sanitizeNickname(favoredNickname)) {
            return this.irc.answer(channel, nickname, 'You can\'t give yourself karma!');
        }

        var karma = this.karma.incrementKarma(favoredNickname);
        this.irc.answer(channel, nickname, favoredNickname + ' has now ' + karma + ' karma!');
    }
};

module.exports = Karma;