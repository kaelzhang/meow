#!/usr/bin/env node

var OPERATORS = {
    '000': { code: 'push', arg: 'signed'},
    '001': { code: 'dup' },
    '010': { code: 'swap' },
    '011': { code: 'discard' },
    '100': { code: 'add' },
    '101': { code: 'sub' },
    '110': { code: 'mul' },
    '111': { code: 'div' },
    '122': { code: 'mod' },
    '020': { code: 'store' },
    '021': { code: 'retrieve' },
    '200': { code: 'label', arg: 'unsigned' },
    '201': { code: 'call', arg: 'unsigned' },
    '202': { code: 'ret' },
    '212': { code: 'jump', arg: 'unsigned' },
    '210': { code: 'jz', arg: 'unsigned' },
    '211': { code: 'jn', arg: 'unsigned' },
    '220': { code: 'exit' },
    '1200': { code: 'outchar' },
    '1201': { code: 'outnum' },
    '1210': { code: 'readchar' },
    '1211': { code: 'readnum' },
};


module.exports = parser;
parser.Parser = Parser;


var node_events = require('events');
var node_util = require('util');
var unicode = require('./unicode');
var read = require('read');


function parser(options) {
    return new Parser(options);
};


// @param {string|Array.<string>} words
function Parser(words) {
    this.words = words;
    this.a = words[0];
    this.b = words[1];
    this.c = words[2];

    this.unicodeAB = unicode(this.a + this.b);
    this.unicodeABC = unicode(words);

    this._createOperators();
}


node_util.inherits(Parser, node_events.EventEmitter);


Parser.prototype._createOperators = function() {
    var operators = this.operators = {};
    var self = this;

    Object.keys(OPERATORS).forEach(function(key) {
        operators[ self._createOperatorKey(key) ] = OPERATORS[key];
    });
};


Parser.prototype._createOperatorKey = function(key) {
    var length = key.length;
    var ret = [];

    while(length --){
        ret[length] = this.words[ key[length] ];
    }

    return ret.join('');
};


Parser.prototype._tokenize = function () {
    var operators = this.operators;
    var keys = Object.keys(operators);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        var match = this.code.match(new RegExp("^" + key + (operators[key].arg ? "([" + this.unicodeAB + "]*)\\n" : "()") + "([^]*)$"));

        if (match) {
            this.code = match[2];

            switch (operators[key].arg) {
                case "unsigned":
                    return [operators[key].code, this._mkInt(match[1])];

                case "signed":
                    var value = this._mkInt(match[1].slice(1));

                    if (match[1][0] == this.b) value *= -1;
                    return [operators[key].code, value];

                default:
                    return [operators[key].code];
            }
        }
    }

    this.emit("unknownCommand", this.code);
};


Parser.prototype._mkInt = function (str) {
    var ret = '';
    for (var i = 0; i < str.length; i++) {
        if (str[i] == this.a) {
            ret += "0";
        } else {
            ret += "1";
        }
    };
    return parseInt(ret, 2);
};


Parser.prototype._execute = function (tokens) {
    var op, arg, // stdin = process.openStdin(),
        pc = 0,
        stack = [],
        heap = {}, callStack = [];

    var ret = '';
    var exit = false;
    var self = this;

    // process.stdin.setRawMode();

    function binOp(s) {
        var a = stack.pop();
        var b = stack.pop();
        stack.push(eval("a" + s + "b"));
        run();
    }

    function jump(c) {
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i][0] == "label" && tokens[i][1] == c) {
                pc = i;
                break;
            }
        }
        run();
    }

    function run() {
        if(exit){
            return;
        }

        if (tokens[pc]) {
            op = tokens[pc][0];
            arg = tokens[pc][1];
            pc += 1;
        } else {
            op = "exit";
        }

        switch (op) {
        case "push":
            stack.push(arg);
            run();
            break;
        case "label":
            run();
            break;
        case "dup":
            stack.push(stack[stack.length - 1]);
            run();
            break;
        case "outnum":
            // process.stdout.write(String(stack.pop()));
            ret += String(stack.pop());
            run();
            break;
        case "outchar":
            // process.stdout.write(new Buffer([stack.pop()]).toString());
            ret += new Buffer([stack.pop()]).toString();
            run();
            break;
        case "add":
            binOp("+");
            break;
        case "sub":
            binOp("-");
            break;
        case "mul":
            binOp("*");
            break;
        case "div":
            binOp("/");
            break;
        case "mod":
            binOp("%");
            break;
        case "jz":
            if (stack.pop() == 0) jump(arg);
            break;
        case "jn":
            if (stack.pop() < 0) jump(arg);
            break;
        case "jump":
            jump(arg);
            break;
        case "discard":
            stack.pop();
            run();
            break;
        case "exit":
            // process.exit(0);
            exit = true;
            self.emit('done', ret);

            break;
        case "store":
            var value = stack.pop();
            var addr = stack.pop();
            heap[addr] = value;
            run();
            break;
        case "call":
            callStack.push(pc);
            jump(arg);
            break;
        case "retreive":
            stack.push(heap[stack.pop()]);
            run();
            break;
        case "ret":
            callStack.pop();
            run();
            break;
        case "readchar":
            // stdin.on('keypress', function (chunk, key) {
            //     heap[stack.pop()] = chunk;
            //     run();
            // });
            read({}, function(err, result) {
                heap[stack.pop()] = result;
                run();
            });
            break;
        case "readnum":
            // stdin.on('keypress', function (chunk, key) {
            //     heap[stack.pop()] = parseInt(chunk);
            //     run();
            // });
            read({}, function(err, result) {
                heap[stack.pop()] = parseInt(result);
                run();
            });
            break;
        case "swap":
            var len = stack.length;
            var tmp = stack[len - 1];
            stack[len - 1] = stack[len - 2];
            stack[len - 2] = tmp;
            run();
            break;
        default:
            // error("Unknown opcode: " + op);
            exit = true;
            this.emit('unknownOperator', op);
            break;
        }
    }

    // if (tokens.length > 0) {
    //     run();
    // } else {
    //     process.exit(0);
    // }

    tokens.length && run();
};


Parser.prototype._createTokens = function() {
    var tokens = [];

    while (this.code !== "" && this.code !== "\n") {
        tokens.push(this._tokenize());
    }

    return tokens;
};


Parser.prototype.run = function(code) {
    this.code = code.replace( new RegExp("[^" + this.unicodeABC + "\\n]", 'g'), '');

    if(/^[\n]+$/.test(this.code) || !this.code){
        this.emit('nothing', this.code);

        return;
    }

    var tokens = this._createTokens();

    this._execute(tokens);
};

