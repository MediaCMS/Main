"use strict"

export default {
    Article: {
        uri: "/статті",
        actions: {
            find: "",
            findOne: "/:alias"
        }
    }, 
    Category: {
        uri: "/категорії",
        actions: {
            find: "",
            findOne: "/:alias"
        }
    },
    Tag: {
        uri: "/мітки",
        actions: {
            find: "",
            findOne: "/:alias"
        }
    },
    Page: {
        uri: "/сторінки",
        actions: {
            find: "",
            findOne: "/:alias"
        }
    },
    User: {
        uri: "/користувачі",
        actions: {
            find: "",
            findOne: "/:alias"
        }
    }
}