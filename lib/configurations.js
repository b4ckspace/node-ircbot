'use strict';

const argv = require('yargs')
    .usage('Usage: $0 --config config')
    .argv;

const path = require('path');
const configurations = require('configurations');

module.exports = configurations.load(path.join(__dirname, '../config'), {
    externalconfig: argv.config
});