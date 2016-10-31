var ms = require('ms');

module.exports = {

    irc: {
        server: 'irc.freenode.net',
        port: 6667,
        nickname: 'schinkenb0t',
        channel: '#schinkenspace',
        commandPrefix: '!'
        /*
        login: {
            username: 'xxx',
            password: 'xxx'
        }
        */
    },

    karma: {
        database: 'karmafile.json'
    },

    spacestatus: {
        url: 'http://status.bckspc.de/spacestatus.php',
        interval: ms('5m')
    },

    redmine: {
        url: 'https://redmine.hackerspace-bamberg.de',
        project: 'backspace',
        user: '',
        password: '',
        intervalMs: ms('5m')
    },

    mqtt: {
        server: 'mqtt.core.bckspc.de',
        topics: {
            pizza: 'test/psa/pizza',
            alarm: 'test/psa/alarm',
            sound: 'test/psa/sound'
        }
    }
};