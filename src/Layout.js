"use strict"

import React, { useState, useEffect, useMemo } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"
import routes from "./routes.js"
import settings from "./settings.js"
import routesAPI from "../routes.js"
import menu from "./menu.js"

const api = axios.create({
    baseURL: settings.api.url,
    timeout: settings.api.timeout,
    headers: {
        'X-API-Key': settings.api.key
    }
})

api.interceptors.request.use(function (config) {
    if (Array.isArray(config.url)) {
        config.url = config.url.join('/')
    }
    return config
}, function (error) {
    console.log('api.request.error.message', error.message)
    if (error?.request) {
        console.log('api.response.error.request', error.request)
    }
    return Promise.reject(error)
})

export default function (props) {

    const [title, setTitle] = useState()
    const [message, setMessage] = useState()

    useMemo(() => {
        api.interceptors.response.use(function (response) {
            return response.data
        }, function (error) {
            console.log('api.response.error.message', error.message)
            if (error?.request) {
                console.log('api.response.error.request', error.request)
            }
            if (error?.response) {
                console.log('api.response.error.response', error.response)
                if (error.response?.data?.message) {
                    setMessage(error.response.data.message)
                }
            }
            return Promise.reject(error)
        })
    }, [])

    useEffect(() => {
        setTitle(props.subRoute?.title ?? null)
        setMessage(null)
    }, [props])

    return (
        <>
            <header>
                <Navigation />
            </header>
            <main id={(props.route.name + '-' + props.subRoute.name).toLowerCase()} className="container">
                <h1 className="my-5">{title}</h1>
                {message ? (<div className="box alert alert-danger text-center">{message}</div>) : null}
                {React.createElement(
                    props.route.module[props.subRoute.name], 
                    { ...props, api, setTitle, setMessage })
                }
            </main>
            <footer className="text-center mt-5">
                <div
                    dangerouslySetInnerHTML={{ __html: settings.alert }}
                    className="alert alert-info my-5 box"
                    role="alert"
                />
                <Menu />
                <p className="text-muted small mt-3">{settings.name} &copy; {settings.copyright}</p>
            </footer>
        </>
    )
}

function Navigation() {

    const navigate = useNavigate()

    const handleSearch = event => {
        event.preventDefault()
        navigate(
            routes.Search.uri + '?запит=' + event.target.querySelector('input').value,
            { replace: true }
        );
    }

    const [categories, setCategories] = useState({ list: [] })

    useEffect(async () => {
        setCategories({ list: await api.get(routesAPI.Category.uri) })
    }, [])

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand" title={settings.slogan}>
                    <img src="/logo.png" alt={settings.name} width="100" />
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <NavItems items={categories.list.slice(0, 6)} />
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false"> ...</a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <NavItems items={categories.list.slice(6)} />
                            </ul>
                        </li>
                    </ul>
                    <form className="d-flex" onSubmit={handleSearch}>
                        <input type="search" name="запит" placeholder="Пошук ..." className="form-control me-2" />
                    </form>
                </div>
            </div>
        </nav>
    )
}

function NavItems(props) {
    return (
        <>
            {props.items.map((item, index) => (
                <li className="nav-item" key={index}>
                    <NavLink to={encodeURI(routes.Category.uri) + '/' + encodeURI(item.alias)} className="nav-link" >
                        {item.title}
                    </NavLink>
                </li>
            ))}
        </>
    )
}

function Menu() {
    return (
        <ul className="nav justify-content-center">
            {menu.map((item, index) => (
                <li className="nav-item" key={index}>
                    <NavLink
                        to={encodeURI(item.url)}
                        className="nav-link small p-2"
                        title={item.description}>
                        {item.title}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
}