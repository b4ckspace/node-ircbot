'use strict';

class Common {

    static sanitizeNickname(nickname) {
        nickname = nickname.replace(/[^a-z]/ig, '');
        nickname = nickname.replace('[m]', '');

        return nickname.toLowerCase();
    }

    static avoidHighlighting(nickname) {
        return nickname.substring(0, 1) + '\u2060' + nickname.substring(1);
    }

    static ellipsis(str, length) {
        if (str.length > length) {
            return str.substring(0, length - 3) + '...';
        }

        return str;
    }
}

module.exports = Common;
