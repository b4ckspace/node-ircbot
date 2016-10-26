var config = require('../configurations');

function Sound(mqttClient) {
    this.mqttClient = mqttClient;
}

Sound.prototype.setup = function(irc) {
    this.irc = irc;
    this.irc.onCommand('s', this.onSound.bind(this));
    this.irc.onCommand('sound', this.onSound.bind(this));
};

Sound.prototype.onSound = function(from, channel, command, payload) {
    var sound = payload.trim();

    this.mqttClient.publish(config.mqtt.topics.sound, sound);
    this.irc.answer(from, channel, 'Playing ' + sound);
};

module.exports = Sound;