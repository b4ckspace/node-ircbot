var config = require('../configurations');
var commons = require('../Utils/Common');
const fs = require('fs');

function Karma(database) {
    this.database = database;
    this.karma = {};
    this.loadDatabase();
}

Karma.prototype.getTop = function(limit) {
    var that = this;

    return Object
        .keys(this.karma)
        .sort(function(a, b) {
            return that.karma[b] - that.karma[a];
        })
        .slice(0, limit)
};

Karma.prototype.incrementKarma = function(nickname) {
    var karma = this.getKarma(nickname) + 1;
    return this.setKarma(nickname, karma);
};

Karma.prototype.getKarma = function(nickname) {
    nickname = commons.sanitizeNickname(nickname);

    if(this.karma[nickname]) {
        return this.karma[nickname];
    }

    return 0;
};

Karma.prototype.setKarma = function(nickname, karma) {
    nickname = commons.sanitizeNickname(nickname);

    this.karma[nickname] = karma;
    this.saveDatabase();

    return karma;
};

Karma.prototype.saveDatabase = function() {
    var karmaDatabase = JSON.stringify(this.karma);

    fs.writeFile(this.database, karmaDatabase, function(error) {
        if(error) {
            return console.error('Error writing karma database to ' + config.karma.database);
        }
    });
};

Karma.prototype.loadDatabase = function() {
    var that = this;

    fs.readFile(this.database, function(error, data) {
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