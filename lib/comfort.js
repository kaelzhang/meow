'use strict';

var commander = require('comfort');
var node_path = require('path');
var typo      = require('typo');

// if you execute a command '<bin> <command> xxx --xxx -x --xxx xxxx -- xxxx'
module.exports = commander({

    // comfort will parse 'xxx --xxx -x --xxx xxxx -- xxxx',
    // by the configuration located at '<option_root>/<command>.js,
    // into an object `options` containing all parsed options
    option_root: node_path.join( __dirname, 'option'),

    // Then, the parsed `options` will be passed as the first argument
    // of the `module.exports` of the module '<command_root>/<command>.js'
    command_root: node_path.join( __dirname, 'command'),

    // `name` will be the name of executable file which defined by `bin` field in your package.json
    name: '喵呜',

    info: '{{bold 一个用来翻译高端程序喵说的话的工具}}'


})

////////////////////////////////////////////////////////////////////////////////////////
// Optional Events

// Event: commandNotFound
// If a subtle command is not found, this event will be emitted.
// If you didn't specify your custom `commandNotFound` event, an default stdout will be displayed

// @param {Object} e
// - name: {string} the value of `bin` field in your package.json
// - command: {string} the name of 'not-found' command

// .on('commandNotFound', function(e) {
//     // You could use [typo](https://github.com/kaelzhang/typo)
//     // to manage your cli output
//     typo.log( '{{name}}: "{{command}}" is not a {{name}} command. See "{{name}} --help".', {
//         name: e.name,
//         command: e.command
//     });
// });

// Event: complete
// This event will be emitted when `callback` of the `module.exports` in '<command_root>/<command>.js'
// If you didn't specify your custom `complete` event, an default stdout will be displayed

// @param {Object} e
// - err: {(string|Error|null)=} the first argument of `callback`
// - name: {string} -
// - command: {string} -
// - data: {Array} the array of arguments of `callback`

// .on('complete', function(e) {
//     if(e.err){
//         typo.log( '{{red ERR!}}', e.err );
//     }else{
//         typo.log( '{{green OK!}}' );
//     }
// });