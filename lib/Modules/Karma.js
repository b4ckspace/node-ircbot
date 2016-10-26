var config = require('../configurations');
var commons = require('../Utils/Common');

const REGEX_KARMA_INCREMENT = /^([^\s:+]+)(:|\s)*(\+\+|\+1)/;

function Karma() {
}

Karma.prototype.setup = function(irc) {
    this.irc = irc;

    this.irc.onCommand('karma', this.onKarma.bind(this));
    this.irc.onCommand('karmatop', this.onKarmaTop.bind(this));

    this.irc.onMessage(this.onMessage.bind(this));
};

Karma.prototype.onKarma = function(from, channel) {
    // TODO: !karma <nickname>
    this.irc.answer(from, channel, 'You have 1337 karma.');
};

Karma.prototype.onKarmaTop = function(from, channel) {
    this.irc.answer(from, channel, 's⁠chinken: 1337, k⁠risha: 42, s⁠tp: 23');
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

        this.irc.answer(channel, nickname, favoredNickname + ' has now xx karma!');
    }
};

module.exports = Karma;