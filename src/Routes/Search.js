"use strict"

import React, { useEffect } from "react"
import { appendScript } from "../utils.js"
import settings from "../settings.js"

export function Index() {

    useEffect(() => {
        appendScript('https://cse.google.com/cse.js?cx=' + settings.searchID)
    }, [])

    return (
        <div className="results">
            <div className="gcse-search" data-queryparametername="запит"></div>
        </div>
    )
}

export default { Index }