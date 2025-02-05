
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
.forEach(image => imagesObserver.observe(image));

// Swipe menu and content
// https://www.kirupa.com/html5/detecting_touch_swipe_gestures.htm
(() => {
    const coordinates = {
        initial: { x: null, y: null },
        current: { x: null, y: null },
        difference: { x: null, y: null }
    }
    const menuElement = document.getElementById('menu')
    // eslint-disable-next-line no-undef
    const menuOffcanvas = new bootstrap.Offcanvas(menuElement)
    const contentElement = document.getElementById('content')
    const contentOffcanvas = contentElement
        // eslint-disable-next-line no-undef
        ? new bootstrap.Offcanvas(contentElement) : null
    const container = document.querySelector('body')
    container.addEventListener('touchstart', event => {
        coordinates.initial.x = event.touches[0].clientX
        coordinates.initial.y = event.touches[0].clientY
    }, false)
    container.addEventListener('touchmove', event => {
        if (coordinates.initial.x === null) return
        if (coordinates.initial.y === null) return
        coordinates.current.x = event.touches[0].clientX
        coordinates.current.y = event.touches[0].clientY
        coordinates.difference.x = coordinates.initial.x - coordinates.current.x
        coordinates.difference.y = coordinates.initial.y - coordinates.current.y
        if (Math.abs(coordinates.difference.x) > Math.abs(coordinates.difference.y)) {
          if (coordinates.difference.x > 0) {
            if (menuOffcanvas._isShown) {
                menuOffcanvas.hide()
            } else {
                if (contentOffcanvas && !contentOffcanvas._isShown) {
                    contentOffcanvas.show()
                }
            }
          } else {
            if (contentOffcanvas && contentOffcanvas._isShown) {
                contentOffcanvas.hide()
            } else {
                if (!menuOffcanvas._isShown) {
                    menuOffcanvas.show()
                }
            }
          }  
        } else {
          if (coordinates.difference.y > 0) {
            //console.log('swiped up')
          } else {
            //console.log('swiped down')
          }  
        }
        coordinates.initial.x = null
        coordinates.current.y = null
        //event.preventDefault()
    }, false)
})()

window.onerror = function(errorMsg, url, lineNumber) {
    console.debug('window.onError: ', errorMsg, url, lineNumber)
    alert(errorMsg)
    return false
}

