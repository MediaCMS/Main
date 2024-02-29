
// adapt image
function adaptImage(uri, width, height = null) {
    const match = uri.match(/(.*)\?width=/)
    if (match) uri = match[1]
    return uri + `?width=${width}&height=${height}`
}

// adaptive lazyload slideshow
const slideshow = document.querySelector('#home #slideshow')
slideshow && slideshow.querySelectorAll('img').forEach(image => {
    image.src = adaptImage(
        image.src, slideshow.offsetWidth, slideshow.offsetHeight
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
            entrie.target.src,
            entrie.target.offsetWidth,
            entrie.target.offsetHeight
        )
        self.unobserve(entrie.target)
    }
}, {
    root: null, rootMargin: '50px', threshold: 0
})
document.querySelectorAll('article img')
.forEach(image => imagesObserver.observe(image))


window.onerror = function(errorMsg, url, lineNumber) {
    console.debug('window.onError: ', errorMsg, url, lineNumber)
    alert(errorMsg)
    return false
}

