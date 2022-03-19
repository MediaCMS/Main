"use strict"

import Controller from "../Controller.js";

export default class Tag extends Controller {

    find = async (request, response) => {
        const filter = this.getFilter(
            { ['сортування-поле']: 'title', ...request.query }
        );
        response.json(
            await (
                await this.db.collection('tags').aggregate([
                    { $match: filter.match },
                    { $sort: { [filter.order.field]: filter.order.direction } },
                    { $skip: filter.skip },
                    { $limit: filter.limit }
                ])
            ).toArray()
        );
    }

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db.collection('tags').find(
                    { alias: request.params.alias, status: true }
                )
            ).next()
        );
    }
}