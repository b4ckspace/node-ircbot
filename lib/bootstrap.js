'use strict';

const config = require('./configurations');

const Irc = require('./Irc/Irc');
const mqtt = require('mqtt');
const mqttClient  = mqtt.connect('mqtt://' + config.mqtt.server);

const KarmaDatabase = require('./Utils/Karma');

const PizzaTimer = require('./Modules/PizzaTimer');
const SpaceStatus = require('./Modules/SpaceStatus');
const Help = require('./Modules/Help');
const Karma = require('./Modules/Karma');
const Alarm = require('./Modules/Alarm');
const Sound = require('./Modules/Sound');
const Redmine = require('./Modules/Redmine');
const UrlInfo = require('./Modules/UrlInfo');

const irc = new Irc();
const karmaDb = new KarmaDatabase(config.karma.database);

irc.addModule(new PizzaTimer(mqttClient));
irc.addModule(new SpaceStatus(mqttClient));
irc.addModule(new Help);
irc.addModule(new Karma(karmaDb));
irc.addModule(new Redmine(karmaDb));
irc.addModule(new Alarm(mqttClient));
irc.addModule(new Sound(mqttClient));
irc.addModule(new UrlInfo);