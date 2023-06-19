
/*
// ajax api
const api = {
    fetch: async (uri, params = {}) => {
        const timeout = params?.timeout ?? 5
        const fetchPromise = fetch(uri, params?.request)
        const timeoutPromise = new Promise(
            resolve => (setTimeout(resolve, timeout * 1000))
        )
        const response = await Promise.race([fetchPromise, timeoutPromise])
        if (!response) {
            throw new Error(`Перевищено час очікування выдповіді сервера (${timeout}c)`)
        }
        if (response.status !== 200) {
            let message = response.status + ' ' + response.statusText
            if (response.status === 500) {
                const text = await response.text()
                if (text.length > 0) message = text
            }
            throw new Error(message)
        }
        switch (params?.output) {
            case undefined:
            case 'text': return response.text()
            case 'json': return response.json()
            default: throw new Error(
                `Unknown output type "${params?.output}"`
            )
        }
    }
}
api.get = async (uri, params) => {
    if (params?.data)
        uri += '?' + new URLSearchParams(params.data)
    return api.fetch(uri, params)
}
api.post = async (uri, params = {}) => {
    params.request = {method: 'POST', body: params.data}
    if (params?.data) {
        if (!(params.data instanceof FormData)) {
            params.request.headers = {'Content-Type': 'application/json'}
            params.request.body = JSON.stringify(params.request.body)
        }
    }
    return api.fetch(uri, params)
}
*/
/*
// google map
function initMap() {
    const mapNode = document.getElementById('map')
    const center = JSON.parse(mapNode.children[0].dataset.center)
    const bounds = JSON.parse(mapNode.children[0].dataset.bounds)
    const objects = JSON.parse(mapNode.children[0].innerText)
    const map = new google.maps.Map(mapNode, { center })
    map.fitBounds(bounds)
    objects.forEach(object => {
        const marker = new google.maps.Marker({
            position: {
                lat: parseFloat(object.location.center.latitude),
                lng: parseFloat(object.location.center.longitude)
            },
            map: map, title: object.title,
            uri: object.uri
        })
        google.maps.event.addListener(marker, 'click', () => {
            window.location.href = '/' + marker.uri
        })
    })
}
*/
window.onerror = function(errorMsg, url, lineNumber) {
    console.debug('window.onError: ', errorMsg, url, lineNumber)
    alert(errorMsg)
    return false
}

