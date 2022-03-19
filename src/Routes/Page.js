"use strict"

import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Card from "../Card.js"
import routes from "../routes.js"
import settings from "../settings.js"
import routesAPI from "../../routes.js"

export function Index(props) {

    const [pages, setPages] = useState()

    useEffect(async () => {
        setPages({ list:
            await props.api.get(routesAPI.Page.uri)
        })
    }, [])

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {pages?.list.map(page => (
                <div className="col" key={page._id}>
                    <Card
                        title={page.title}
                        description={page.description}
                        image={page.image}
                        uri={routes.Category.uri + '/' + page.alias}
                    />
                </div>
            ))}
        </div>
    )
}

export function View(props) {

    const [page, setPage] = useState()
    const params = useParams()

    useEffect(async () => {
        const page = await props.api.get([routesAPI.Page.uri, params.alias])
        if (!page) {
            return props.setMessage('Сторінка не знайдена')
        }
        props.setTitle(page.title)
        setPage(page)
    }, [params]);

    return page?.body ?
        (<>
            <p className="lead mt-4">{page.description}</p>
            {page?.image ? (<p><img src={settings.images.url + page.image} alt={page.title} className="w-100" /></p>) : null}
            <div className="body" dangerouslySetInnerHTML={{ __html: page.body }}></div>
        </>) : null
}

export default { Index, View }