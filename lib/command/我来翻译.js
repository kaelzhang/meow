'use strict';

var read = require('read');
var typo = require('typo');
var parser = require('../parser');

var meow = parser('喵呜　').on('done', function(result) {
    typo.log('{{bold 你家的猫在说:}}');
    typo.log(result);

}).on('nothing', function() {
    typo.log('{{red|bold 喂喂，这明明不是猫叫！}}');

}).on('unknownOperator', function() {
    typo.log('{{blue 你家的猫只是在乱嚷嚷而已 ╮(╯▽╰)╭}}');

}).on('unknowCommand', function() {
    typo.log('{{blue 你家的猫只是在乱嚷嚷而已 ╮(╯▽╰)╭}}');
});


// @param {Object} options
//     The parsed argument object(according to the rules defined in ../option/sample.js) 
//     will be the first argument

// @param {function(err, ...)} callback
// @param {(string|Error|null)=} err if err is not null, `comfort` will consider it as a failure
//     err will be a object member to emit to `'complete'` event of `comfort` instance
var translate = module.exports = function(options, callback) {
    // your code ...

    translate.getCode(function(err, code) {
        meow.run(code);
    });
};


translate.getCode = function(callback) {

    var code = '';

    function r(done) {
        read({
            prompt: '>'

        }, function(err, result, is_default) {
            if(err){
                done(err);
            }

            if(result === ''){
                return done(null, code);
            }

            code += result + '\n';

            r(done);
        });
    }

    r(callback);
};

