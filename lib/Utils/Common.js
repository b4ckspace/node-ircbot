
class Common {

    static sanitizeNickname(nickname) {
        return nickname.replace(/[^a-z]/ig, '').toLowerCase();
    }

    static avoidHighlighting(nickname) {
        return '\u2060' + nickname
    }
}

module.exports = Common;
