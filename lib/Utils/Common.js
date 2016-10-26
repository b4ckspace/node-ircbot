
module.exports.sanitizeNickname = function (nickname) {
    return nickname.replace(/[^a-z]/ig, '').toLowerCase();
};

module.exports.avoidHighlighting = function (nickname) {
    return '\u200B' + nickname
};