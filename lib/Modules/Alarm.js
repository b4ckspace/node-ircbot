'use strict';

const config = require('../configurations');

class Alarm {

    constructor(mqttClient) {
        this.mqttClient = mqttClient;
    }

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('alarm', this.onAlarm.bind(this));
    }

    onAlarm(channel, nickname, command, payload) {
        const message = `${nickname}: ${payload}`;

        this.mqttClient.publish(config.mqtt.topics.alarm, message, {
            qos: 1
        });

        this.irc.answer(channel, nickname, 'ALAAAARM');
    }
}

module.exports = Alarm;