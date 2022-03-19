"use strict"

import Controller from "../Controller.js";

export default class Page extends Controller {

    find = async (request, response) => {
        response.json(await (
                await this.db.collection('pages').find({ status: true }).sort({ title: 1 })
            ).toArray()
        )
    }

    findOne = async (request, response) => {
        response.json(await (
            await this.db.collection('pages').find({ alias: request.params.alias, status: true })
        ).next())
    }
}