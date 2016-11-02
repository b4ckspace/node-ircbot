# bckspc-bot

## Description

bckspc-bot is an IRC bot for [backspace][1]'s channel on freenode (#backspace).
It provides various features to interact with space infrastructure and other
handy things.

## Commands

<dl>
  <dt>!inspace</dt>
  <dd>Shortcut: i. List the members currently present.</dd>

  <dt>!pizza NUM</dt>
  <dd>Shortcut: p. Alert you in NUM minutes. Default is 15 minutes.</dd>

  <dt>NICK +1</dt>
  <dd>Give NICK one karma point.</dd>

  <dt>!karma [NICKS]</dt>
  <dd>Shortcut: k. List each NICK's karma score.
      If no NICK is supplied, list the issuer's score.</dd>

  <dt>!karmatop [NUM]</dt>
  <dd>List the top NUM karma scorers. Default is 3, maximum is 5.</dd>

  <dt>!alarm MSG</dt>
  <dd>Shortcut: a. Broadcasts MSG in the local network.
      Other services may display MSG on the LED-board or similar.<\dd>
</dl>

## Other features

* Append "open"/"close" to the topic, depending on whether someone is currently
  present.

* Voice members who are currently in the space.

* Give karma for completing redmine issues.

## Configuration

bckspc-bot requires a JSON configuration which is located at config/default.js


[1]: http://www.hackerspace-bamberg.de/Hauptseite