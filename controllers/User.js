"use strict"

import { ObjectId } from 'mongodb';
import Controller from "../Controller.js";

export default class User extends Controller {

    find = async (request, response) => {
        response.json(await (
            await this.db.collection('users')
                .find({ role: new ObjectId("61fae1ba6be8f90a409ecda6"), status: true })
                .sort({ title: 1 })
        ).toArray());
    }

    findOne = async (request, response) => {
        response.json(await (
            await this.db.collection('users').find({ alias: request.params.alias, status: true })
        ).next());
    }
}