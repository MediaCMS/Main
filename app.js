"use strict"

import express from "express";
import process from "process";
import { MongoClient } from 'mongodb';
import cors from "cors";
import routes from "./routes.js";
import settings from "./settings.js";

const app = express();
const server = app.listen(settings.port, settings.ip, () => {
    console.log(`HTTP server started [${app.get('env')}]`);
    console.log(`Listening at ${settings.ip}:${settings.port}`);
});
const client = new MongoClient(settings.db);
await client.connect();
const db = client.db();
const router = express.Router();

const controllers = {};
for (const [controllerName, controller] of Object.entries(routes)) {
    controllers[controllerName] = new (
        await import('./controllers/' + controllerName + '.js')
    ).default(db, controller);
}

app.use(cors(settings.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}
/*
app.use(function (request, response, next) {
    //console.log(decodeURI(request.originalUrl));
    //console.log(decodeURI(request.path), request.params, request.query);
    //console.log(request.headers['x-api-key']);
    next();
});
*/
for (const [controllerName, controller] of Object.entries(routes)) {
    //console.log(controllerName)
    for (const [actionName, actionUri] of Object.entries(controller.actions)) {
        //console.log('  ', actionName, "\t", decodeURI(settings.uri + controller.uri + actionUri));
        router.get(
            encodeURI(settings.uri + controller.uri + actionUri),
            controllers[controllerName][actionName]
        );
    }
}

app.use('/', router);

app.use(async (error, request, response, next) => {
    console.error(error);
    if (response.headersSent) return next(error);
    response.status(500).json({ message: error.message, name: error.name });
})

process.on('unhandledRejection', async (error) => {
    console.error('Unhandled Rejection', error);
    process.exit(1);
})

process.on('SIGINT', async () => {
    await client.close();
    await server.close();
    process.exit(0);
    console.log(`HTTP server closed`);
})