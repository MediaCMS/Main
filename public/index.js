
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


// Swipe
// https://www.kirupa.com/html5/detecting_touch_swipe_gestures.htm
(() => {
    const container = document.querySelector('body')
    container.addEventListener('touchstart', startTouch, false)
    container.addEventListener('touchmove', moveTouch, false)
    let initialX = null;
    let initialY = null;
    function startTouch(e) {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
    }

    function moveTouch(e) {
        if (initialX === null) return;
        if (initialY === null) return;
    
        var currentX = e.touches[0].clientX;
        var currentY = e.touches[0].clientY;
    
        var diffX = initialX - currentX;
        var diffY = initialY - currentY;
    
        if (Math.abs(diffX) > Math.abs(diffY)) {
          // sliding horizontally
          if (diffX > 0) {
            // swiped left
            console.log("swiped left");
            alert("swiped left")
          } else {
            // swiped right
            console.log("swiped right");
            alert("swiped right")
          }  
        } else {
          // sliding vertically
          if (diffY > 0) {
            // swiped up
            console.log("swiped up");
            alert("swiped up")
          } else {
            // swiped down
            console.log("swiped down");
            alert("swiped down")
          }  
        }
    
        initialX = null;
        initialY = null;
    
        e.preventDefault();
    };
})()

window.onerror = function(errorMsg, url, lineNumber) {
    console.debug('window.onError: ', errorMsg, url, lineNumber)
    alert(errorMsg)
    return false
}

