var config = require('../configurations');
var ms = require('ms');

function PizzaTimer(mqttClient) {
    this.mqttClient = mqttClient;
}

PizzaTimer.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('pizza', this.onCommand.bind(this));
};

PizzaTimer.prototype.onCommand = function(from, channel, command, message, isQuery) {

    if(isQuery) {
        return false;
    }

    var that = this;
    var minutes = parseInt(message, 10) || 15;
    var timeoutMs = ms(minutes + 'm');

    that.irc.answer(from, channel, "I won't forget it!");

    setTimeout(function() {
        that.mqttClient.publish(config.mqtt.topics.pizza, minutes);
        that.irc.answer(from, channel, "Time is up!");
    }, timeoutMs);
};

module.exports = PizzaTimer;