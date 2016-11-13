
class Common {

    static sanitizeNickname(nickname) {
        return nickname.replace(/[^a-z]/ig, '').toLowerCase();
    }

    static avoidHighlighting(nickname) {
        return '\u8288' + nickname
    }
}

module.exports = Common;
