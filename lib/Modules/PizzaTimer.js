const config = require('../configurations');
const ms = require('ms');

class PizzaTimer {

    constructor(mqttClient) {
        this.mqttClient = mqttClient;
    }

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('pizza', this.onCommand.bind(this));
    }

    onCommand(channel, nickname, command, message, isQuery) {

        if (isQuery) {
            return this.irc.answer(channel, nickname, 'You can\'t set a timer by query');
        }

        const minutes = parseInt(message, 10) || 15;
        const timeoutMs = ms(minutes + 'm');

        if (timeoutMs > config.pizzaTimer.maxTimeoutMs) {
            return this.irc.answer(channel, nickname, 'You can\'t set timer longer than 1 day');
        }

        this.irc.answer(channel, nickname, 'I won\'t forget it!');

        setTimeout(() => {
            this.mqttClient.publish(config.mqtt.topics.pizza, '' + minutes, {
                qos: 1
            });

            this.irc.answer(channel, nickname, 'Time is up!');
        }, timeoutMs);
    }
}

module.exports = PizzaTimer;