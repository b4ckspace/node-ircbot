'use strict';

const config = require('../configurations');
const commons = require('../Utils/Common');

const MODE_OP = '@';
const MODE_VOICED = '+';

class SpaceStatus {

    constructor(mqttClient) {
        this.presentMembers = [];
        this.status = false;

        this.mqttClient = mqttClient;
    }

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('i', this.onInSpace.bind(this));
        this.irc.onCommand('inspace', this.onInSpace.bind(this));

        this.irc.onChannelEvent('names', this.onNames.bind(this));
        this.irc.onEvent('topic', this.onTopic.bind(this));
        this.irc.onEvent('join', this.onJoin.bind(this));

        this.mqttClient.subscribe(config.spacestatus.memberNames);
        this.mqttClient.subscribe(config.spacestatus.status);

        this.mqttClient.on('message', (topic, payload) => {
            const message = '' + payload;

            switch (topic) {
                case config.spacestatus.memberNames:
                    this.presentMembers = message.split(', ').filter(entry => entry.trim());
                    return this.irc.send('NAMES');

                case config.spacestatus.status:
                    this.status = (message === 'open');
                    return this.irc.send('TOPIC');
            }
        });
    }

    onInSpace(channel, nickname) {

        if (this.presentMembers.length === 0) {
            return this.irc.answer(channel, nickname, 'Backspace is empty');
        }

        const members = this.presentMembers.map((memberName) => {
            return commons.avoidHighlighting(memberName);
        }).join(', ');

        const message = this.presentMembers.length + ' members present: ' + members;
        this.irc.answer(channel, nickname, message.trim());
    }

    onTopic(channel, topic) {

        let newTopic = '';
        if (this.status) {
            newTopic = topic.replace('closed', 'open');
        } else {
            newTopic = topic.replace('open', 'closed');
        }

        if (newTopic !== topic) {
            this.irc.send('TOPIC', newTopic);
        }
    }

    onJoin(channel, nickname) {
        const sanitizedNickname = commons.sanitizeNickname(nickname);

        let membersMapping = this.getSanitizedNicknameMap(this.presentMembers);

        if (membersMapping[sanitizedNickname]) {
            this.irc.setVoice(nickname, true);
        }
    };

    onNames(names) {

        if (names[config.irc.nickname] !== MODE_OP) {
            // TODO: Logging
            return false;
        }

        const filtered = Object.keys(names).filter((nickname) => {
            return (names[nickname] === MODE_VOICED);
        });

        const nameMapping = this.getSanitizedNicknameMap(Object.keys(names));
        const voicedMapping = this.getSanitizedNicknameMap(filtered);
        const membersMapping = this.getSanitizedNicknameMap(this.presentMembers);

        Object.keys(membersMapping).forEach((member) => {
            // Present member that doesn't currently have voice
            const ircNickname = nameMapping[member];
            if (!voicedMapping[member] && names[ircNickname] !== undefined) {
                this.irc.setVoice(ircNickname, true);
            }
        });

        Object.keys(voicedMapping).forEach((name) => {
            // There's a nickname which has voice, but isn't present anymore
            if (!membersMapping[name]) {
                this.irc.setVoice(voicedMapping[name], false);
            }
        })
    }

    getSanitizedNicknameMap(names) {
        let result = {};

        names.forEach((name) => {
            const tmp = commons.sanitizeNickname(name);
            result[tmp] = name;
        });

        return result;
    }
}

module.exports = SpaceStatus;