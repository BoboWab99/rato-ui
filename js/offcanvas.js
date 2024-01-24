// Resizable offcanvas

const DRAG_DIST_BEFORE_RESIZE = 100

let offcanvas, startClientY, startHeight, isResizing

const viewportHeightFn = () => {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

const px = (number) => {
    return `${number}px`
}

const oh = (offcanvas) => {
    return offcanvas.offsetHeight
}

const initializeResizableOffcanvas = (offcanvas) => {
    const viewportHeight = viewportHeightFn()
    const elementHeight = oh(offcanvas)
    const initialHeight = Math.min(elementHeight, 0.5 * viewportHeight)
    const maxHeight = Math.min(elementHeight, 0.925 * viewportHeight)

    offcanvas.setAttribute("data-initialheight", initialHeight)
    offcanvas.setAttribute("data-maxheight", maxHeight)
    offcanvas.style.maxHeight = px(maxHeight)
    offcanvas.style.setProperty("--bs-offcanvas-height", px(initialHeight))
}


const startResizeFn = (clientY) => {
    isResizing = true
    startClientY = clientY
    startHeight = oh(offcanvas)
    offcanvas.style.userSelect = "none"
}

const resizeFn = (clientY) => {
    if (!isResizing) return

    const deltaY = startClientY - clientY
    const newHeight = startHeight + deltaY

    const dragDistance = Math.min(DRAG_DIST_BEFORE_RESIZE, 0.333 * oh(offcanvas))
    const initialHeight = offcanvas.getAttribute("data-initialheight")
    const maxHeight = offcanvas.getAttribute("data-maxheight")

    if (deltaY > dragDistance) {
        offcanvas.style.setProperty("--bs-offcanvas-height", px(maxHeight))
    } else if (Math.abs(deltaY) > dragDistance) {
        if (newHeight < initialHeight) {
            dom.get(`#${offcanvas.id} [data-bs-dismiss="offcanvas"]`).click()
        } else {
            offcanvas.style.setProperty("--bs-offcanvas-height", px(initialHeight))
        }
    }
}

const endResizeFn = () => {
    if (isResizing) {
        offcanvas.style.userSelect = "auto"
        isResizing = false
    }
}


window.addEventListener("DOMContentLoaded", () => {
    dom.all(".offcanvas-resizable").forEach(offcanvas => {
        initializeResizableOffcanvas(offcanvas)
        
        offcanvas.addEventListener("hidden.bs.offcanvas", () => {
            const initialHeight = offcanvas.getAttribute("data-initialheight")
            offcanvas.style.setProperty("--bs-offcanvas-height", px(initialHeight))
        })
    })
})


// Mouse events
document.addEventListener("mousedown", (e) => {
    const handle = e.target.closest(".resize-handle")
    if (handle) {
        offcanvas = handle.closest(".offcanvas-resizable")
        startResizeFn(e.clientY)
    }
})
document.addEventListener("mousemove", (e) => resizeFn(e.clientY))
document.addEventListener("mouseup", () => endResizeFn())

// Touch events
document.addEventListener("touchstart", (e) => {
    const handle = e.target.closest(".resize-handle")
    if (handle) {
        offcanvas = handle.closest(".offcanvas-resizable")
        startResizeFn(e.touches[0].clientY)
    }
})
document.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) {
        resizeFn(e.touches[0].clientY)
    }
})
document.addEventListener("touchend", () => endResizeFn())