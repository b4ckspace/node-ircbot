'use strict';

const config = require('../configurations');
const ms = require('ms');

const REGEX_HOURS_MINUTES = /(\d{1,2})[:h]\s*(\d{1,2})m?/;
const REGEX_MINUTES = /(\d{1,2})m?/;

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

        const timeoutMs = this.convertMessageToTimeoutMs(message);
        if (timeoutMs === null) {
            return this.irc.answer(channel, nickname, 'Your input is invalid. Please see !help for more information');
        }

        if (timeoutMs > config.pizzaTimer.maxTimeoutMs) {
            return this.irc.answer(channel, nickname, 'You can\'t set timer longer than 1 day');
        }

        this.irc.answer(channel, nickname, 'I won\'t forget it!');

        const minutes = Math.floor(timeoutMs / 1000 / 60);
        setTimeout(() => {
            this.mqttClient.publish(config.mqtt.topics.pizza, '' + minutes, {
                qos: 1
            });

            this.irc.answer(channel, nickname, 'Time is up!');
        }, timeoutMs);
    }

    convertMessageToTimeoutMs(message) {
        if (!message) {
            return ms('15m');
        }

        let m = message.match(REGEX_HOURS_MINUTES);
        if (m) {
            return ms(m[1] + 'h') + ms(m[2] + 'm');
        }

        m = message.match(REGEX_MINUTES);
        if (m) {
            return ms(m[1] + 'm');
        }

        return null;
    }
}

module.exports = PizzaTimer;