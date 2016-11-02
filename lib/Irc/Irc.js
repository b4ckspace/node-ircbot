var irc = require('irc');
var config = require('../configurations');

function Irc() {

    var options = {
        channels: [config.irc.channel],
        port: config.irc.port || 6667,
        debug: true,
        autoRejoin: true,
        stripColors: true,
        realName: config.irc.realname || 'Backspace IRC Bot'
    };

    if(config.irc.login) {
        options.userName = config.irc.login.username;
        options.password = config.irc.login.password;
    }

    // TODO: set ident
    // TODO: set "description"
    this.irc = new irc.Client(config.irc.server, config.irc.nickname, options);
}

Irc.prototype.addModule = function(module) {
    module.setup(this);
};

Irc.prototype.onCommand = function(command, callback) {

    var commandString = config.irc.commandPrefix + command;
    var commandRegex = new RegExp('^' + commandString + '\\b');

    this.onMessage(function(channel, nickname, message, isQuery) {
        if (message.match(commandRegex)) {
            var payload = message.substr(commandString.length).trim();
            callback(channel, nickname, command, payload, isQuery);
        }
    });
};

Irc.prototype.onMessage = function(callback) {
    this.irc.addListener('message', function(nickname, channel, message) {
        var isQuery = !channel.match(/^[#&]/);
        callback(channel, nickname, message, isQuery);
    });
};

Irc.prototype.say = function(message) {
    this.irc.say(config.irc.channel, message);
};

Irc.prototype.answer = function(channel, nickname, message) {

    // If channel is the nickname of the bot, it's a query!
    if(channel == config.irc.nickname) {
        channel = nickname;
    }

    this.irc.say(channel, nickname + ': ' + message);
};

Irc.prototype.onEvent = function(event, callback) {
    this.irc.addListener(event, callback);
};

Irc.prototype.onChannelEvent = function(event, callback) {
    this.irc.addListener(event + config.irc.channel, callback);
};

Irc.prototype.send = function() {
    var args = Array.from(arguments);
    var command = args.shift();

    this.irc.send.apply(this.irc, [command, config.irc.channel].concat(args));
};

Irc.prototype.setVoice = function(nickname, voice) {
    var flag = (voice) ? '+v' : '-v';
    this.send('MODE', flag, nickname);
};

module.exports = Irc;