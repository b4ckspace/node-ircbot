var config = require('../configurations');

function Alarm(mqttClient) {
    this.mqttClient = mqttClient;
}

Alarm.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('alarm', this.onAlarm.bind(this));
};

Alarm.prototype.onAlarm = function(from, channel, command, payload) {
    this.mqttClient.publish(config.mqtt.topics.alarm, payload);
    this.irc.answer(from, channel, 'ALAAAARM');
};

module.exports = Alarm;