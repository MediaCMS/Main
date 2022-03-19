"use strict"

import Home from "./Routes/Home.js"
import Article from "./Routes/Article.js"
import Category from "./Routes/Category.js"
import Tag from "./Routes/Tag.js"
import Page from "./Routes/Page.js"
import User from "./Routes/User.js"
import Search from "./Routes/Search.js"

export default {
    Home: {
        uri: "/",
        module: Home,
        subRoutes: {
            Index: {}
        }
    },
    Article: {
        uri: "/статті",
        module: Article,
        subRoutes: {
            Index: {
                title: "Статті",
                description: "Список статей",
                keywords: "статті, список міст",
            },
            View: {
                alias: ":alias",
            }
        }
    },
    Category: {
        uri: "/категорії",
        module: Category,
        subRoutes: {
            Index: {
                title: "Категорії",
                description: "Опис категорії та список статей, що входять до неї",
                keywords: "категорії, статті в категорії",
            },
            View: {
                alias: ":alias",
            },
        }
    },
    Tag: {
        uri: "/мітки",
        module: Tag,
        subRoutes: {
            Index: {
                title: "Мітки",
                description: "Список міток сайту",
                keywords: "мітки, список міток"
            },
            View: {
                alias: ":alias",
            }
        }
    },
    User: {
        uri: "/автори",
        module: User,
        subRoutes: {
            Index: {
                title: "Автори",
                description: "Список авторів статей",
                keywords: "автори, список авторів",
            },
            View: {
                alias: ":alias",
            }
        }
    },
    Page: {
        uri: "/сторінки",
        module: Page,
        subRoutes: {
            Index: {
                title: "Сторінки",
                description: "Список статичних сторінок сайту",
                keywords: "сторінки, статичні сторінки, статичні сторінки сайту, список сторінок",
            },
            View: {
                alias: ":alias",
            }
        }
    },
    Search: {
        uri: "/пошук",
        module: Search,
        subRoutes: {
            Index: {
                title: "Пошук",
                description: "Пошук на сайті",
                keywords: "пошук, пошук на сайті"
            }
        }
    }
}