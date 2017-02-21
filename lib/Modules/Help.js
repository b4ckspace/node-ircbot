'use strict';

class Help {

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('help', this.onHelp.bind(this));
    }

    onHelp(channel, nickname, command, payload) {
        this.irc.answer(channel, nickname, 'see https://github.com/b4ckspace/node-ircbot');
    }
}

module.exports = Help;