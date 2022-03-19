"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Card from "../Card.js"
import routes from "../routes.js"
import routesAPI from "../../routes.js"

export function Index(props) {

    const [users, setUsers] = useState()

    useEffect(async () => {
        setUsers({ list:
            await props.api.get(routesAPI.User.uri)
        })
    }, [])

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {users?.list.map(user => (
                <div className="col" key={user._id}>
                    <Card
                        title={user.title}
                        description={user.description}
                        image={user.image}
                        uri={routes.User.uri + '/' + user.alias}
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
        const user = await props.api.get([routesAPI.User.uri, params.alias])
        if (!user) {
            return props.setMessage('Автор не знайдений')
        }
        props.setTitle(user.title)
        setArticles({ list: 
            await props.api.get(routesAPI.Article.uri, { params: { 'автор': user._id } })
        })
    }, [searchParams])

    return (
        <>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {articles?.list.map(article => (
                    <div className="col" key={article._id}>
                        <Card
                            title={article.title}
                            description={article.description}
                            image={article.image}
                            uri={routes.Article.uri + '/' + article.alias}
                            button={{ title: article.category.title, uri: routes.Category.uri + '/' + article.category.alias }}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default { Index, View }