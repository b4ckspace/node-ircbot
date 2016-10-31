var config = require('../configurations');
var commons = require('../Utils/Common');

const fs = require('fs');

const REGEX_KARMA_INCREMENT = /^([^\s:+]+)(:|\s)*(\+\+|\+1)/;

function Karma() {
    this.karma = {};
    this.loadDatabase();
}

Karma.prototype.setup = function(irc) {
    this.irc = irc;

    this.irc.onCommand('karma', this.onKarma.bind(this));
    this.irc.onCommand('karmatop', this.onKarmaTop.bind(this));

    this.irc.onMessage(this.onMessage.bind(this));
};

Karma.prototype.onKarma = function(channel, nickname, command, payload) {
    var karma = this.getKarma(nickname);

    if(payload) {
        karma = this.getKarma(payload);
        this.irc.answer(channel, nickname, payload + ': ' + karma);
    } else {
        this.irc.answer(channel, nickname, 'You have ' + karma + ' karma.');
    }
};

Karma.prototype.onKarmaTop = function(channel, nickname, command, payload) {

    var limit = 3;
    if(payload) {
        limit = Math.min(parseInt(payload, 10), 10);
    }

    var that = this;
    var top = Object.keys(this.karma)
        .sort(function(a, b) {
            return that.karma[b] - that.karma[a];
        })
        .slice(0, limit)
        .map(function(nickname) {
            return nickname + ': ' + that.karma[nickname];
        });

    this.irc.answer(channel, nickname, top.join(', '));
};

Karma.prototype.onMessage = function(channel, nickname, message, isQuery) {

    var matches = message.match(REGEX_KARMA_INCREMENT);
    if(matches) {
        var favoredNickname = matches[1];

        if(isQuery) {
            return this.irc.answer(nickname, nickname, 'You can only give karma in the channel');
        }

        if(commons.sanitizeNickname(nickname) == commons.sanitizeNickname(favoredNickname)) {
            return this.irc.answer(channel, nickname, 'You can\'t give yourself karma!');
        }

        var karma = this.incrementKarma(favoredNickname);
        this.irc.answer(channel, nickname, favoredNickname + ' has now ' + karma + ' karma!');
    }
};

Karma.prototype.getKarma = function(nickname) {
    nickname = commons.sanitizeNickname(nickname);

    if(this.karma[nickname]) {
        return this.karma[nickname];
    }

    return 0;
};

Karma.prototype.incrementKarma = function(nickname) {
    nickname = commons.sanitizeNickname(nickname);

    if(this.karma[nickname]) {
        this.karma[nickname]++;
    } else {
        this.karma[nickname] = 1;
    }

    this.saveDatabase();
    return this.karma[nickname];
};

Karma.prototype.saveDatabase = function() {
    var karmaDatabase = JSON.stringify(this.karma);

    fs.writeFile(config.karma.database, karmaDatabase, function(error) {
        if(error) {
            return console.error('Error writing karma database to ' + config.karma.database);
        }
    });
};

Karma.prototype.loadDatabase = function() {
    var that = this;

    fs.readFile(config.karma.database, function(error, data) {
        if(error) {
            return;
        }

        try {
            that.karma = JSON.parse(data);
        } catch (e) {
            console.log('Can\'t load karma file');
        }
    });
};

module.exports = Karma;