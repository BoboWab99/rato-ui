// Resizable offcanvas

let offcanvas, startClientY, startHeight, isResizing

const offcanvasEl = () => {
    return dom.get(".offcanvas-resizable.show")
}

const resetOffcanvasStyle = () => {
    offcanvas.style = ""
}

const startResizeFn = (clientY) => {
    isResizing = true
    startClientY = clientY
    // offcanvas = offcanvasEl()
    startHeight = parseInt(document.defaultView.getComputedStyle(offcanvas).height, 10)
    offcanvas.style.userSelect = "none"
}

const resizeFn = (clientY) => {
    if (!isResizing) return

    const deltaY = startClientY - clientY
    const newHeight = startHeight + deltaY
    // offcanvas = offcanvasEl()

    if (deltaY < -50) {
        console.log(offcanvas.id)
        dom.get(`[data-bs-dismiss="offcanvas"]`, offcanvas).click()
        resetOffcanvasStyle()
        return
    }
    if (newHeight < window.innerHeight - 50) {
        offcanvas.style.cssText += `--bs-offcanvas-height: ${newHeight}px;`
    }
}

const endResizeFn = () => {
    if (isResizing) {
        // offcanvas = offcanvasEl()
        offcanvas.style.userSelect = "auto"
        isResizing = false
    }
}

// Reset offcanvas style
dom.all(".offcanvas-resizable").forEach(offcanvas => {
    offcanvas.addEventListener("hidden.bs.offcanvas", () => {
        resetOffcanvasStyle()
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