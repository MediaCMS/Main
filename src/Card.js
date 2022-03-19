"use strict"

import React from "react"
import { NavLink } from "react-router-dom"
import settings from "./settings.js"

export default function (props) {

    return (
        <div className="card">
            <div className="card-img-top">
                {props?.image ? (
                    <NavLink to={props.uri}>
                        <img src={settings.images.url + props.image} alt={props.title} className="g-4"/>
                    </NavLink>
                ) : null}
            </div>
            <div className="card-body">
                <h5 className="card-title">
                    <NavLink to={props.uri} title={props.description}>{props.title}</NavLink>
                </h5>
                {props?.subTitle ? (
                    <p className="small">
                        <NavLink to={props.subTitle.uri}><i>{props.subTitle.title}</i></NavLink>
                    </p>
                ) : null}
                <p className="card-text">{props.description}</p>
                {props?.button ? (
                    <NavLink to={props.button.uri} className="btn btn-primary">{props.button.title}</NavLink>
                ) : null}
             </div>
        </div>
    )
}