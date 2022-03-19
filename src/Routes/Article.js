"use strict"

import React, { useState, useEffect } from "react"
import { NavLink, useParams, useSearchParams } from "react-router-dom"
import Card from "../Card.js"
import routes from "../routes.js"
import settings from "../settings.js"
import routesAPI from "../../routes.js"

export function Index(props) {

    const [articles, setArticles] = useState()
    const [searchParams] = useSearchParams()

    useEffect(async () => {
        setArticles({ list:
            await props.api.get(routesAPI.Article.uri)
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

export function View(props) {

    const params = useParams()
    const [article, setArticle] = useState()

    useEffect(async () => {
        const article = await props.api.get([routesAPI.Article.uri, params.alias])
        if (!article) {
            return props.setMessage('Стаття не знайдена')
        }
        props.setTitle(article.title)
        article.time = new Date(article.time)
        article.body = article.body.replaceAll(/<p>(.*<img.*)<\/p>/g, '<p class="image">$1</p>')
        setArticle(article)
    }, [])

    return article?.body ?
        (<>
            <p className="text-secondary small mt-1">
                <i>{
                    article.time.getDay() + ' ' +
                    settings.months[article.time.getMonth()] + ' ' +
                    article.time.getFullYear() + ' року  —  ' 
                }</i>
                <NavLink to={routes.User.uri + '/' + article.user.alias}>{article.user.title}</NavLink>
            </p>
            <p className="lead mt-4">{article.description}</p>
            {article?.image ? (
                <p>
                    <img src={settings.images.url + article.image} alt={article.title} className="w-100" />
                </p>
            ) : null}
            <div className="body" dangerouslySetInnerHTML={{ __html: article.body }}></div>
            {article?.tags ? (
                <p className="tags">
                    <strong>Мітки:&nbsp;</strong>
                    {article.tags.map((tag, index) => (
                        <NavLink to={routes.Tag.uri + '/' + tag.alias} key={index}>{tag.title}</NavLink>
                    ))}
                </p>
            ) : null}
        </>) : null
}

export default {Index, View}