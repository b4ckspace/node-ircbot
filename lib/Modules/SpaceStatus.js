const config = require('../configurations');
const commons = require('../Utils/Common');
const SpaceAPI = require('../Utils/SpaceAPI');

const MODE_OP = '@';
const MODE_VOICED = '+';

class SpaceStatus {

    constructor() {
        this.spaceApi = new SpaceAPI(config.spacestatus.url);
    }

    setup(irc) {
        this.irc = irc;
        this.irc.onCommand('i', this.onInSpace.bind(this));
        this.irc.onCommand('inspace', this.onInSpace.bind(this));

        this.irc.onChannelEvent('names', this.onNames.bind(this));
        this.irc.onEvent('topic', this.onTopic.bind(this));
        this.irc.onEvent('join', this.onJoin.bind(this));

        setInterval(() => {
            this.spaceApi.update().then(() => {
                this.irc.send('NAMES');
                this.irc.send('TOPIC');
            });
        }, config.spacestatus.intervalMs);
    }

    onInSpace(channel, nickname) {
        this.spaceApi.getPresentMembers((error, presentMembers) => {

            if (error) {
                return this.irc.answer(channel, nickname, "Can't retrieve current Spacestatus!");
            }

            if (presentMembers.length == 0) {
                return this.irc.answer(channel, nickname, 'Backspace is empty');
            }

            var members = presentMembers.map((memberName) => {
                return commons.avoidHighlighting(memberName);
            }).join(', ');

            var message = presentMembers.length + ' members present: ' + members;
            this.irc.answer(channel, nickname, message.trim());
        });
    }

    onTopic(channel, topic) {
        this.spaceApi.getPresentMembers((error, presentMembers) => {

            var newTopic = '';
            if (presentMembers.length > 0) {
                newTopic = topic.replace('closed', 'open');
            } else {
                newTopic = topic.replace('open', 'closed');
            }

            if (newTopic != topic) {
                this.irc.send('TOPIC', newTopic);
            }
        });
    }

    onJoin(channel, nickname) {
        var sanitizedNickname = commons.sanitizeNickname(nickname);

        this.spaceApi.getPresentMembers((error, members) => {
            var membersMapping = this.getSanitizedNicknameMap(members);

            if (membersMapping[sanitizedNickname]) {
                this.irc.setVoice(nickname, true);
            }
        });
    };

    onNames(names) {

        if (names[config.irc.nickname] !== MODE_OP) {
            // TODO: Logging
            return false;
        }

        var filtered = Object.keys(names).filter((nickname) => {
            return (names[nickname] == MODE_VOICED);
        });

        var nameMapping = this.getSanitizedNicknameMap(Object.keys(names));
        var voicedMapping = this.getSanitizedNicknameMap(filtered);

        this.spaceApi.getPresentMembers((error, members) => {
            var membersMapping = this.getSanitizedNicknameMap(members);

            Object.keys(membersMapping).forEach((member) => {

                // Present member that doesn't currently have voice
                var ircNickname = nameMapping[member];
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
        });
    }

    getSanitizedNicknameMap(names) {
        var result = {};

        names.forEach((name) => {
            var tmp = commons.sanitizeNickname(name);
            result[tmp] = name;
        });

        return result;
    }
}

module.exports = SpaceStatus;