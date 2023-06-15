import fs from 'fs';
import config from './config.js';

const logStream = fs.createWriteStream(config.log, { flags: 'a' });

export default async function log(msg) {
    let message = '', stack = {};
    if (msg instanceof Error) {
        message = error.name + ': ' + error.message;
        if (typeof error.stack !== 'undefined') {
            stack.line = error.stack.split('\n')[1];
            if (stack.line !== 'undefined') {
                stack.index = stack.line.indexOf('at ') + 3;
                stack.file = stack.line.slice(stack.index);
                message += ' [' + stack.file + ']';
            }
        }
    } else {
        message = msg;
    }
    const date = new Date();
    message = date.getFullYear() +
        '-' + padStart(date.getMonth() + 1) +
        '-' + padStart(date.getDate()) +
        ' ' + padStart(date.getHours()) +
        ':' + padStart(date.getMinutes()) +
        ':' + padStart(date.getSeconds()) +
        ' ' + message + '\n';
    logStream.write(message);
}

function padStart(value, length = 2, symbol = '0') {
    return value.toString().padStart(length, symbol);
}