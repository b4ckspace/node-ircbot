
class Common {

    static sanitizeNickname(nickname) {
        return nickname.replace(/[^a-z]/ig, '').toLowerCase();
    }

    static avoidHighlighting(nickname) {
        return nickname.substring(0, 1) + '\u2060' + nickname.substring(1);
    }
}

module.exports = Common;
