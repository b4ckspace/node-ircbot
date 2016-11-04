
class Common {

    static sanitizeNickname(nickname) {
        return nickname.replace(/[^a-z]/ig, '').toLowerCase();
    }

    static avoidHighlighting(nickname) {
        return '\u200B' + nickname
    }
}

module.exports = Common;