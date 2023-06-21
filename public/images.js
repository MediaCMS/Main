// images config
const images = {
    host: document.querySelector('meta[name="images.host"]').content,
    widths: document.querySelector('meta[name="images.widths"]').content.split(' ')
}

// adapt image
function adaptImage(uri, width, height = null) {
    const container = { width, height }
    const size = uri.match(/\/(\d{3,4})\.jpg$/) // x(\d{3,4})
    const maximum = { width: parseInt(size[1]), height: parseInt(size[1]) / 1.777 }
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
        image.dataset.src, slideshow.offsetWidth, slideshow.offsetHeight
    )
    return image
})

// lazyload article images adaptive
const imagesObserver = new IntersectionObserver((entries, self) => {
    for (const entrie of entries) {
        if (!entrie.isIntersecting) continue
        entrie.target.src = adaptImage(
            entrie.target.dataset.src, entrie.target.offsetWidth
        )
        self.unobserve(entrie.target)
    }
}, {
    root: null, rootMargin: '50px', threshold: 0
})
document.querySelectorAll('article img')
.forEach(image => imagesObserver.observe(image))

// lazyload thumbnails
const thumbnailsObserver = new IntersectionObserver((entries, self) => {
    for (const entrie of entries) {
        if (!entrie.isIntersecting) continue
        entrie.target.src = images.host + entrie.target.dataset.src.replace(/\/\d+\.jpg$/, '/0320.jpg')
        self.unobserve(entrie.target)
    }
 }, { root: null, rootMargin: '50px', threshold: 0 })
document.querySelectorAll('.card img')
    .forEach(image => thumbnailsObserver.observe(image))

/*
// lazyload more posts
new IntersectionObserver((entries, self) => {
    if (!entries[0].isIntersecting) return
    const posts = entries[0].target.querySelectorAll('div.post')
    posts.forEach(post => {
        const url = post.dataset.image.replace(/\/\d+x\d+\.jpg$/, '/320.jpg')
        post.style.backgroundImage = `url(${images.host}/${url})`
    })
    self.disconnect();
}, { root: null, rootMargin: '50px', threshold: 0 }).observe(
    document.querySelector('#more')
)
*/
