// Run
// enableTooltips()
// playWelcomeGif()
// addNavTooltips()
// toggleNavShowOnMobile()

window.addEventListener("DOMContentLoaded", () => {
    playWelcomeGif()
    toggleNavShowOnMobile()
    enableTooltips()
    addNavTooltips()
})

window.addEventListener("resize", () => {
    addNavTooltips()
    toggleNavShowOnMobile()
})


/**
 * Hide or show top and bottom navigations
 * when user scrolls up or down
 */
function toggleNavShowOnMobile() {
    let lastScrollTop = 0

    const toggleShow = () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop

        if (currentScroll > lastScrollTop) {
            dom.id("header").classList.add("hidden")
            dom.id("bottomNav").classList.add("hidden")
            // console.log("Scrolling down...")
        } else {
            dom.id("header").classList.remove("hidden")
            dom.id("bottomNav").classList.remove("hidden")
            // console.log("Scrolling up...")
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll // For Mobile or negative scrolling
    }

    const vw = window.innerWidth
    if (vw < 576) window.addEventListener("scroll", toggleShow)
    else window.removeEventListener("scroll", toggleShow)
}


/**
 * Add tooltips to main side navigation icons
 * when sidebar is shrunk
 */
function addNavTooltips() {
    const vw = window.innerWidth
    const mainNav = dom.id("nav.nav-main")
    const navItems = dom.all(".nav-item", mainNav)

    const addTooltipProps = (item, props = {}) => {
        let added = false
        Object.entries(props).forEach(([prop, value]) => {
            if (!item.getAttribute(prop)) {
                item.setAttribute(prop, value)
                if (!added) added = true
            }
        })
        return added
    }

    // bs.media-breakpoint-between(sm, lg)
    if (vw >= 576 && vw < 992) {
        navItems.forEach(item => {
            const added = addTooltipProps(item, {
                "data-bs-toggle": "tooltip",
                "data-bs-placement": "right",
                "data-bs-title": item.closest("li").getAttribute("page-name")
            })
            if (added) new bootstrap.Tooltip(item)
        })
    } else {
        navItems.forEach(item => {
            item.removeAttribute("data-bs-toggle")
            item.removeAttribute("data-bs-placement")
            item.removeAttribute("data-bs-title")

            const tooltip = bootstrap.Tooltip.getInstance(item); // Get the tooltip instance
            if (tooltip) {
                tooltip.dispose(); // Dispose of the tooltip instance
            }
        })
    }
}


/**
 * Play welcome GIF
 */
function playWelcomeGif() {
    const gifs = [
        "https://giphy.com/embed/XeXJlF9ouoWkeAyHhO", // Hi
        "https://giphy.com/embed/905sSos1A9yZ3nnjh9", // Welcome back
        "https://giphy.com/embed/Me81YDlmvEbCCk548x", // Shop
        "https://giphy.com/embed/kxR5r7o7xn3xsy2j4f", // Delivering the goods
    ]

    let index = 0

    const changeGIF = () => {
        const iframeWrapper = dom.id("ctaGifIframe").closest(".cta-gif-frame")
        if (index === 3) iframeWrapper.classList.add("show-we")
        else iframeWrapper.classList.remove("show-we")

        dom.id("ctaGifIframe").src = gifs[index]
        index = (index + 1) % gifs.length // Loop through the GIFs
        setTimeout(changeGIF, 2000)
    }

    changeGIF()
}


/**
 * Disable all tooltips
 */
function disableTooltips() {
    const tooltipTriggerList = document.querySelectorAll(`[data-bs-toggle="tooltip"]`)
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl) // Get the tooltip instance
        if (tooltip) tooltip.dispose() // Dispose of the tooltip instance
    })
}


/**
 * Enable all tooltips
 */
function enableTooltips() {
    const tooltipTriggerList = document.querySelectorAll(`[data-bs-toggle="tooltip"]`)
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}