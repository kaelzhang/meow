'use strict';


// Ever needed to escape '\n' as '\\n'? This function does that for any character,
// using hex and/or Unicode escape sequences (whichever are shortest).
// [Demo](http://mothereff.in/js-escapes)
// [Gist](https://gist.github.com/mathiasbynens/1243213)
module.exports = function (str) {
    return str.replace(/[\s\S]/g, function(character) {
        var escape = character.charCodeAt().toString(16),
            longhand = escape.length > 2;
        return '\\' + (longhand ? 'u' : 'x') + ('0000' + escape).slice(longhand ? -4 : -2);
    });
};