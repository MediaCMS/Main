
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
/*
// offcanvas manual widths
var offcanvasElementList = [].slice.call(document.querySelectorAll('.offcanvas'))
console.log('offcanvasElementList', offcanvasElementList)
var offcanvasList = offcanvasElementList.map(function (offcanvasEl) {
    console.log('offcanvas manual widths')
    return new bootstrap.Offcanvas(offcanvasEl)
});
*/
const menuElement = document.getElementById('menu')
console.log(menuElement)
const menuOffcanvas = new bootstrap.Offcanvas(menuElement)
console.log(menuOffcanvas)

// Swipe
// https://www.kirupa.com/html5/detecting_touch_swipe_gestures.htm
console.log();
(() => {
    let container = document.querySelector('body')
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
            console.log('swiped left')
            if (menuOffcanvas._isShown) menuOffcanvas.hide()
          } else {
            console.log('swiped right');
            if (!menuOffcanvas.__isShown) menuOffcanvas.show()
            let container = document.querySelector('body')
          }  
        } else {
          if (diffY > 0) {
            //console.log("swiped up");
          } else {
            //console.log("swiped down");
          }  
        }
    
        initialX = null;
        initialY = null;
    
        //e.preventDefault();
    };
})()

window.onerror = function(errorMsg, url, lineNumber) {
    console.debug('window.onError: ', errorMsg, url, lineNumber)
    alert(errorMsg)
    return false
}

