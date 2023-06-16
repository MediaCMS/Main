// images config
const images = {
    host: document.querySelector('meta[name="images.host"]').content,
    widths: document.querySelector('meta[name="images.widths"]').content.split(' ')
}

// adapt image
function adaptImage(uri, width, height = null) {
    const container = { width, height }
    const size = uri.match(/\/(\d{3,4})x(\d{3,4})\.jpg$/)
    const maximum = { width: parseInt(size[1]), height: parseInt(size[2]) }
    const ratio = maximum.width / maximum.height
    const adaptive = { width: parseInt(images.widths) }
    for(const width of images.widths) {
        const current = { width: parseInt(width) }
        current.height = Math.floor(current.width / ratio)
        if (current.width >= maximum.width) break
        if (container.height) {
            if ((current.width >= container.width)
                    && (current.height > container.height)) {
                break
            }
        } else {
            if (current.width > container.width) break
        }
        adaptive.width = current.width
    }
    return images.host + uri
        .replace(/\/\d{3,4}x\d{3,4}\.jpg$/, '/' + adaptive.width + '.jpg')
}

// adaptive lazyload slideshow
const slideshow = document.querySelector('#home #slideshow')
slideshow && slideshow.querySelectorAll('img').forEach(image => {
    image.src = adaptImage(
        image.dataset.url, slideshow.offsetWidth, slideshow.offsetHeight
    )
    return image
})

// lazyload article main background image adaptive
const main = document.querySelector('article div.main[data-image]')
if (main) {
    main.style.backgroundImage = `url('${
        adaptImage(
            main.dataset.image, main.offsetWidth, main.offsetHeight
        )
    }')`
}

// lazyload article images adaptive
const imagesObserver = new IntersectionObserver((entries, self) => {
    for (const entrie of entries) {
        if (!entrie.isIntersecting) continue
        entrie.target.src = adaptImage(
            entrie.target.dataset.url, entrie.target.offsetWidth
        )
        self.unobserve(entrie.target)
    }
}, {
    root: null, rootMargin: '50px', threshold: 0
})
document.querySelectorAll('article img')
.forEach(image => imagesObserver.observe(image))

// lazyload more posts
new IntersectionObserver((entries, self) => {
    if (!entries[0].isIntersecting) return
    const posts = entries[0].target.querySelectorAll('div.post')
    posts.forEach(post => {  
        const url = post.dataset.image.replace(/\/\d+x\d+\.jpg$/,'/320.jpg')
        post.style.backgroundImage = `url(${images.host}/${url})`
    })
    self.disconnect();
}, { root: null, rootMargin: '50px', threshold: 0 }).observe(
    document.querySelector('#more')
)

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

window.onerror = function(errorMsg, url, lineNumber) {
    console.debug('window.onError: ', errorMsg, url, lineNumber)
    alert(errorMsg)
    return false
}

