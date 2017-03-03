'use strict';

class Help {

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('help', this.onHelp.bind(this));
    }

    onHelp(channel, nickname, command, payload) {
        if (payload === '') {
            this.sendHelp(channel, nickname);
        } else {
            this.sendHelp(channel, payload);
        }
    }

    sendHelp(channel, nickname) {
        this.irc.answer(channel, nickname,
                        'see https://github.com/b4ckspace/node-ircbot');
    }
}

module.exports = Help;