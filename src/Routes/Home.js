"use strict"

import React, { useState, useEffect } from "react"
import Card from "../Card.js"
import routes from "../routes.js"
import settings from "../settings.js"
import routesAPI from "../../routes.js"

export function Index(props) {

    const [articles, setArticles] = useState()

    useEffect(async () => {
        setArticles({ list: 
            await props.api.get(routesAPI.Article.uri, { params: { 'обмеження': 6 } })
        })
    }, [])

    return (
        <>
            <div id="carousel" className="carousel slide carousel-fade my-4" data-bs-ride="carousel" data-interval="5000">
                <div className="carousel-indicators">
                    {articles?.list.slice(0, 3).map((article, index) => (
                        <button type="button" data-bs-target="#carousel" data-bs-slide-to={index} aria-current="true" aria-label="Slide 1" className={!index ? 'active' : null} key={index}></button>
                    ))}
                </div>
                <div className="carousel-inner">
                    {articles?.list.slice(0, 3).map((article, index) => (
                        <div className={'carousel-item' + (!index ? ' active' : '')} key={index}>
                            <img className="d-block w-100 h-100" src={settings.images.url + article.image} alt={article.title} />
                            <div className="carousel-caption d-none d-md-block">
                                <h2>{article.title}</h2>
                                <p>{article.description}</p>
                            </div>
                            <a href={routes.Article.uri + '/' + article.alias}></a>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className="row">
                {articles?.list.slice(3).map(article => (
                    <div className="col" key={article._id}>
                        <Card
                            title={article.title}
                            subTitle={{ title: article.user.title, uri: routes.User.uri + '/' + article.user.alias }}
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

export default { Index }