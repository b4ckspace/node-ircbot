var config = require('../configurations');

function Alarm(mqttClient) {
    this.mqttClient = mqttClient;
}

Alarm.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('alarm', this.onAlarm.bind(this));
};

Alarm.prototype.onAlarm = function(channel, nickname, command, payload) {
    this.mqttClient.publish(config.mqtt.topics.alarm, payload);
    this.irc.answer(channel, nickname, 'ALAAAARM');
};

module.exports = Alarm;