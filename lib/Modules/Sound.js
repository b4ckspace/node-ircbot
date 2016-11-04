var config = require('../configurations');

class Sound {

    constructor(mqttClient) {
        this.mqttClient = mqttClient;
    }

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('s', this.onSound.bind(this));
        this.irc.onCommand('sound', this.onSound.bind(this));
    }

    onSound(channel, nickname, command, payload) {
        var sound = payload.trim();

        this.mqttClient.publish(config.mqtt.topics.sound, sound);
        this.irc.answer(channel, nickname, 'Playing ' + sound);
    }
}

module.exports = Sound;