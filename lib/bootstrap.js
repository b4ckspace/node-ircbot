var Irc = require('./Irc/Irc');

var PizzaTimer = require('./Modules/PizzaTimer');
var SpaceStatus = require('./Modules/SpaceStatus');
var Karma = require('./Modules/Karma');
var Alarm = require('./Modules/Alarm');
var Sound = require('./Modules/Sound');

var irc = new Irc();
irc.addModule(new PizzaTimer);
irc.addModule(new SpaceStatus);
irc.addModule(new Karma);
irc.addModule(new Alarm);
irc.addModule(new Sound);