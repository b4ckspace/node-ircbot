'use strict';

const irc = require('irc');
const config = require('../configurations');

class Irc {

    constructor() {
        let options = {
            channels: [config.irc.channel],
            port: config.irc.port || 6667,
            debug: true,
            autoRejoin: true,
            stripColors: true,
            realName: config.irc.realname || 'Backspace IRC Bot'
        };

        if (config.irc.login) {
            options.userName = config.irc.login.username;
            options.password = config.irc.login.password;
        }

        this.irc = new irc.Client(config.irc.server, config.irc.nickname, options);
        this.irc.setMaxListeners(15);

        this.irc.addListener('error', (message) => {
            console.log('error: ', message);
        });
    }

    addModule(module) {
        module.setup(this);
    }

    onCommand(command, callback) {
        const commandString = config.irc.commandPrefix + command;
        const commandRegex = new RegExp('^' + commandString + '\\b', 'i');

        this.onMessage((channel, nickname, message, isQuery) => {
            if (message.trim().match(commandRegex)) {
                const payload = message.substr(commandString.length).trim();
                callback(channel, nickname, command, payload, isQuery);
            }
        });
    }

    onMessage(callback) {
        this.irc.addListener('message', (nickname, channel, message) => {
            const isQuery = !channel.match(/^[#&]/);
            callback(channel, nickname, message, isQuery);
        });
    }

    say(message) {
        this.irc.say(config.irc.channel, message);
    }

    answer(channel, nickname, message) {
        // If channel is the nickname of the bot, it's a query!
        if (channel == config.irc.nickname) {
            channel = nickname;
        }

        this.irc.say(channel, nickname + ': ' + message);
    }

    onEvent(event, callback) {
        this.irc.addListener(event, callback);
    }

    onChannelEvent(event, callback) {
        this.irc.addListener(event + config.irc.channel, callback);
    }

    send() {
        let args = Array.from(arguments);
        const command = args.shift();

        this.irc.send.apply(this.irc, [command, config.irc.channel].concat(args));
    }

    setVoice(nickname, voice) {
        const flag = (voice) ? '+v' : '-v';
        this.send('MODE', flag, nickname);
    }
}

module.exports = Irc;
