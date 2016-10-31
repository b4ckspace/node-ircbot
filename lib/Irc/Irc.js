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

Irc.prototype.say = function(channel, message) {
    this.irc.say(channel, message);
};

Irc.prototype.answer = function(channel, nickname, message) {
    this.say(channel, nickname + ': ' + message);
};

Irc.prototype.onNames = function(callback) {
    this.irc.addListener('names' + config.irc.channel, callback);
};

Irc.prototype.requestNames = function() {
    this.irc.send('NAMES', config.irc.channel);
};

Irc.prototype.requestTopic = function() {
    this.irc.send('TOPIC', config.irc.channel);
};

Irc.prototype.setVoice = function(nickname, voice) {
    var flag = (voice) ? '+v' : '-v';
    this.irc.send('MODE', config.irc.channel, flag, nickname);
};

module.exports = Irc;