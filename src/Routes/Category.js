"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Card from "../Card.js"
import routes from "../routes.js"
import routesAPI from "../../routes.js"

export function Index(props) {

    const [categories, setCategories] = useState()

    useEffect(async () => {
        setCategories({ list:
            await props.api.get(routesAPI.Category.uri)
        })
    }, [])

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {categories?.list.map(category => (
                <div className="col" key={category._id}>
                    <Card
                        title={category.title}
                        description={category.description}
                        image={category.image}
                        uri={routes.Category.uri + '/' + category.alias}
                    />
                </div>
            ))}
        </div>
    )
}

export function View(props) {

    const [articles, setArticles] = useState()
    const [searchParams] = useSearchParams()
    const params = useParams()

    useEffect(async () => {
        const category = await props.api.get([routesAPI.Category.uri, params.alias])
        if (!category) {
            return props.setMessage('Категорія не знайдена')
        }
        props.setTitle(category.title)
        setArticles({ list: 
            await props.api.get(
                routesAPI.Article.uri, { params: { 'категорія': category._id }
            })
        })
    }, [params, searchParams])

    return (
        <>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {articles?.list.map(article => (
                    <div className="col" key={article._id}>
                        <Card
                            title={article.title}
                            subTitle={{ title: article.user.title, uri: routes.User.uri + '/' + article.user.alias }}
                            description={article.description}
                            image={article.image}
                            uri={routes.Article.uri + '/' + article.alias}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default { Index, View }