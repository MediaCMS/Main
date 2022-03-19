"use strict"

import Controller from "../Controller.js";

export default class Article extends Controller {

    find = async (request, response) => {
        const filter = this.getFilter(request.query);
        response.json(
            await (
                await this.db.collection('articles').aggregate([
                    { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
                    { $unwind: '$category' },
                    { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
                    { $unwind: '$user' },
                    { $project: {
                        time: 1, title: 1, description: 1, image: 1, tags: 1, alias: 1, status: 1,
                        category: { _id: 1, title: 1, alias: 1 },
                        user: { _id: 1, title: 1, alias: 1 }
                    } },
                    { $match: filter.match},
                    { $sort: { [filter.order.field]: filter.order.direction } },
                    { $skip: filter.skip },
                    { $limit: filter.limit }
                ])
            ).toArray()
        );
    }

    findOne = async (request, response) => {
        response.json(await (await this.db.collection('articles').aggregate([
            { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
            { $unwind: '$category' },
            { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } },
            { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
            { $unwind: '$user' },
            { $match: { alias: request.params.alias, status: true } }
        ])).next());
    }
}