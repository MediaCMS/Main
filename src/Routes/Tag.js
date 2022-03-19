"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Card from "../Card.js"
import routes from "../routes.js"
import routesAPI from "../../routes.js"

export function Index(props) {

    const [tags, setTags] = useState()
    const [searchParams] = useSearchParams()

    useEffect(async () => {
        setTags({ list: 
            await props.api.get(routesAPI.Tag.uri)
        })
    }, [searchParams])

    return (
        <>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {tags?.list.map(tag => (
                    <div className="col" key={tag._id}>
                        <Card
                            title={tag.title}
                            description={tag.description}
                            image={tag.image}
                            uri={routes.Tag.uri + '/' + tag.alias}
                        />
                    </div>
                ))}                
            </div>
        </>
    )
}

export function View(props) {

    const [articles, setArticles] = useState()
    const [searchParams] = useSearchParams()
    const params = useParams()

    useEffect(async () => {
        const tag = await props.api.get([routesAPI.Tag.uri, params.alias])
        if (!tag) {
            return props.setMessage('Мітка не знайдена')
        }
        props.setTitle(tag.title)
        setArticles({ list: 
            await props.api.get(routesAPI.Article.uri, { params: { 'мітка': tag._id } })
        })
    }, [searchParams])

    return (
        <>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {articles?.list.map(article => (
                    <div className="col" key={article._id}>
                        <Card
                            title={article.title}
                            subTitle={{
                                title: article.user.title,
                                uri: routes.User.uri + '/' + article.user.alias
                            }}
                            description={article.description}
                            image={article.image}
                            uri={routes.Article.uri + '/' + article.alias}
                            button={{
                                title: article.category.title,
                                uri: routes.Category.uri + '/' + article.category.alias
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default { Index, View }