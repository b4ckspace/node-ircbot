var config = require('../configurations');

class Alarm {

    constructor(mqttClient) {
        this.mqttClient = mqttClient;
    }

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('alarm', this.onAlarm.bind(this));
    }

    onAlarm(channel, nickname, command, payload) {
        this.mqttClient.publish(config.mqtt.topics.alarm, payload);
        this.irc.answer(channel, nickname, 'ALAAAARM');
    }
}

module.exports = Alarm;