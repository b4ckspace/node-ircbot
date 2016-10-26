var irc = require('irc');
var config = require('../configurations');

function Irc() {

    var options = {
        channels: config.irc.channels,
        port: config.irc.port || 6667
    };

    if(config.irc.login) {
        options.userName = config.irc.login.username;
        options.password = config.irc.login.password;
    }

    this.irc = new irc.Client(config.irc.server, config.irc.nickname, {
        debug: true,
        autoRejoin: true,
        stripColors: true,
        channels: [config.irc.channel]
    });
}

Irc.prototype.addModule = function(module) {
    module.setup(this);
};

Irc.prototype.onCommand = function(command, callback) {

    var commandString = config.irc.commandPrefix + command;
    var commandRegex = new RegExp('^' + commandString + '\\b');

    this.irc.addListener('message', function(from, channel, message) {
        var isQuery = !channel.match(/^[#&]/);

        if (message.match(commandRegex)) {
            var payload = message.substr(commandString.length).trim();
            callback(from, channel, command, payload, isQuery);
        }
    });
};

Irc.prototype.onMessage = function(callback) {

    this.irc.addListener('message', function(nickname, channel, message) {
        var isQuery = !channel.match(/^[#&]/);
        callback(channel, nickname, message, isQuery);
    });
};

Irc.prototype.onJoin = function(callback) {
    this.irc.addListener('join', callback);
};

Irc.prototype.say = function(channel, message) {
    this.irc.say(channel, message);
};

Irc.prototype.answer = function(channel, nickname, message) {
    this.say(channel, nickname + ': ' + message);
};

module.exports = Irc;