"use strict"

import Controller from "../Controller.js";

export default class Category extends Controller {

    find = async (request, response) => {
        response.json(await (
            await this.db.collection('categories').find({ status: true }).sort({ order: 1 })
        ).toArray());
    }

    findOne = async (request, response) => {
        response.json(await (
            await this.db.collection('categories').find({ alias: request.params.alias, status: true })
        ).next());
     }
}