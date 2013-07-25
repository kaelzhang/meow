'use strict';

var node_path = require('path');
var node_url = require('url');

// Suppose the name of the executable file of `bin` field in your package.json is
// `blah`

// These are the configuration of command line options for `blah sample` command.

// $ blah sample -h
// Then `exports.usage` will be shown up.
exports.usage = [
    '喵呜 我来翻译'
];

// The description of `blah sample` command
exports.info = '翻译高端程序喵说的话成为人类语言';


exports.options = {

    // // If the argv contains '--cwd abc', this rule will be applied.
    // cwd: {

    //     // Then '-c' will be a shorthand of '--cwd'
    //     short: 'c',

    //     // The argument will be parsed and checked as `require('path')`.
    //     // if 
    //     type: node_path,

    //     // The default value of `options.cwd`, 
    //     value: process.cwd(),

    //     // $ blah help sample
    //     // Then '--cwd <type>, <info>' will be shown up
    //     info: 'description for the current option'
    // },

    // depth: {
    //     type: Number,

    //     short: 'd',

    //     // Then '-c' will be equivalent to '--depth 10'.
    //     // By default, 
    //     // `short_pattern` is ['--depth'], 
    //     // i.e. the value of `depth` would be defined by the next argument
    //     short_pattern: ['--depth', '10'],

    //     // `value` could also be a setter function.
    //     // the first argument `value` is the formerly-parsed value of `depth`
    //     // `parsed` is the already parsed object
    //     value: function(value, parsed) {
    //         return value > 10 ? 10 : value
    //     },

    //     info: 'depth'
    // }
};
