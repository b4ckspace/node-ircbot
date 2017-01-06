const config = require('../configurations');
const commons = require('../Utils/Common');
const fs = require('fs');

class Karma {

    constructor(database) {
        this.database = database;
        this.karma = {};
        this.loadDatabase();
    }

    getTop(limit) {
        return Object
            .keys(this.karma)
            .sort((a, b) => {
                return this.karma[b] - this.karma[a];
            })
            .slice(0, limit)
    }

    incrementKarma(nickname) {
        var karma = this.getKarma(nickname) + 1;
        return this.setKarma(nickname, karma);
    }

    getKarma(nickname) {
        nickname = commons.sanitizeNickname(nickname);

        if (this.karma[nickname]) {
            return this.karma[nickname];
        }

        return 0;
    }

    setKarma(nickname, karma) {
        nickname = commons.sanitizeNickname(nickname);

        this.karma[nickname] = karma;
        this.saveDatabase();

        return karma;
    }

    saveDatabase() {
        var karmaDatabase = JSON.stringify(this.karma);

        fs.writeFile(this.database, karmaDatabase, (error) => {
            if (error) {
                return console.error('Error writing karma database to ' + config.karma.database);
            }
        });
    }

    loadDatabase() {
        fs.readFile(this.database, (error, data) => {
            if (error) {
                return;
            }

            try {
                this.karma = JSON.parse(data);
            } catch (e) {
                console.log('Can\'t load karma file');
            }
        });
    }
}

module.exports = Karma;