import fs from 'fs';
import config from './config.js';

const logStream = fs.createWriteStream(config.log, { flags: 'a' });

export default async function log(msg) {
    let message = '';
    if (typeof msg === 'Error') {
        message = error.name + ': ' + error.message;
        if (typeof error.stack !== 'undefined') {
            const stackLine = error.stack.split('\n')[1];
            if (typeof stackLine !== 'undefined') {
                const stackIndex = stackLine.indexOf('at ') + 3;
                const stackFile = stackLine.slice(stackIndex, stackLine.indexOf('at ').length);
                message += ' [' + stackFile + ']';
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