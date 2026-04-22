import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import PluginsSection, { pluginGithubUrl } from './Plugins'
import UiUxExamplesSection from './UiUxExamplesSection'
import './css/Work.css'

/** Files in `src/assets/works/thumbnails/` are bundled; match filename stem to work `slug` (case-insensitive). */
const WORK_THUMBNAILS = import.meta.glob('./assets/works/thumbnails/*.{jpg,jpeg,png,gif,webp,avif,svg}', {
    eager: true,
    import: 'default'
})

function workHtmlSrc(relativePath) {
    if (typeof relativePath !== 'string' || relativePath.length === 0) return ''
    const encodedPath = relativePath
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/')
    const rawBase =
        typeof import.meta.env.BASE_URL === 'string' && import.meta.env.BASE_URL.length > 0
            ? import.meta.env.BASE_URL
            : './'
    const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`
    if (import.meta.env.DEV) {
        return `/src/assets/works/${encodedPath}`
    }
    return `${base}assets/works/${encodedPath}`
}

const HTML_WORK_PATHS = {
    'belvita-animated-banners': 'Belvita Animated Banners/index.html',
    cinemark: 'Cinemark/index.html',
    'dominoes-stranger-things': 'Dominoes Stranger Things/index.html',
    'dodge-ram-carousel': 'Dodge Ram Carousel/lighthouse.html',
    'home-depot-bathroom-game': 'Home Depot Bathroom Game/index.html',
    'home-depot-game': 'Home Depot Game/970x250.html',
    'oceania-cruises': 'Oceania Cruises - 970x250/index.html',
    'seadoo-pins': 'SeaDoo Pins/index.html',
    'toyota-game': 'Toyota Game/lighthouse.html',
    'wwf-butterflies': 'WWF Butterflies/970x250.html',
    'wwf-quiz': 'WWF Quiz - 300x600/index.html'
}

function resolveHtmlWorkSrc(work) {
    const isResolvedWorkPath = (value) =>
        value.includes('/assets/works/') ||
        value.startsWith('./assets/works/') ||
        value.startsWith('assets/works/')

    if (work?.mediaType !== 'html') return work?.mediaSrc
    const direct = work?.mediaSrc
    if (Array.isArray(direct)) {
        const resolved = direct
            .map((entry) => {
                if (typeof entry !== 'string' || entry.length === 0 || entry.includes('undefined')) return null
                if (/^(https?:)?\/\//.test(entry) || entry.startsWith('/') || isResolvedWorkPath(entry)) return entry
                return workHtmlSrc(entry)
            })
            .filter(Boolean)
        if (resolved.length > 0) return resolved
    }
    if (typeof direct === 'string' && direct.length > 0 && !direct.includes('undefined')) {
        if (/^(https?:)?\/\//.test(direct) || direct.startsWith('/') || isResolvedWorkPath(direct)) return direct
        return workHtmlSrc(direct)
    }
    const fallbackPath = HTML_WORK_PATHS[work?.slug]
    return workHtmlSrc(fallbackPath)
}

const works = [
    {
        slug: 'afeela',
        title: 'Afeela',
        description: 'Branding campaign for Afeela, a new electric vehicle company.',
        thumbPosition: 'center center',
        thumbSrc: new URL('./assets/works/Afeela/assets-horizon-desktop/v75_1440x405_learnmore_E2E_sci_24_exp.png', import.meta.url).href,
        mediaType: 'html',
        size: {
            w: 1400,
            h: 315
        },
        mediaSrc: workHtmlSrc('Afeela/horizon-single.html')
    },
    {
        slug: 'aspca',
        title: 'ASPCA',
        description: 'Awareness campaign for the ASPCA.',
        thumbPosition: 'center center',
        thumbSrc: new URL('./assets/works/ASPCA/bg.jpg', import.meta.url).href,
        mediaType: 'image',
        size: {
            w: 1440,
            h: 1024
        },
        mediaSrc: new URL('./assets/works/ASPCA/bg.jpg', import.meta.url).href
    },
    {
        slug: 'belvita-animated-banners',
        title: 'Belvita Animated Banners',
        description: 'A belVita awareness campaign built as lightweight HTML5 rich media, with timeline-based animation, sprite optimization, and staged preloading so each panel starts fast while still supporting branded motion and polished transitions.',
        thumbPosition: 'center center',
        mediaType: 'html',
        size: {
            w: 300,
            h: 600
        },
        mediaSrc: workHtmlSrc('Belvita Animated Banners/index.html')
    },
    {
        slug: 'cinemark',
        title: 'Cinemark',
        description: 'A data-driven Cinemark unit that combines dynamic movie metadata with a custom carousel UI; built with vanilla JS component patterns, structured config objects, and event tracking hooks so creative updates can ship without rebuilding core logic.',
        thumbPosition: '20% center',
        mediaType: 'html',
        size: {
            w: 970,
            h: 250
        },
        mediaSrc: workHtmlSrc('Cinemark/index.html')
    },
    {
        slug: 'cologuard',
        title: 'Cologuard',
        description: 'An animated banner that uses a custom GSAP animation to drive users to the Cologuard mobile game.',
        thumbPosition: 'center center',
        thumbSrc: new URL('./assets/works/Cologuard/assets/frame1bg.jpg', import.meta.url).href,
        mediaType: 'html',
        size: {
            w: 640,
            h: 960
        },
        mediaSrc: workHtmlSrc('Cologuard/index.html')
    },
    {
        slug: 'dominoes-stranger-things',
        title: 'Domino’s Stranger Things',
        description: 'A Stranger Things collaboration campaign translated into an interactive mini-experience, using layered assets, responsive scene composition, and reusable animation utilities to keep visual continuity across multiple ad placements.',
        thumbPosition: 'center center',
        mediaType: 'html',
        size: {
            w: 1024,
            h: 768
        },
        mediaSrc: workHtmlSrc('Dominoes Stranger Things/index.html')
    },
    {
        slug: 'dodge-ram-carousel',
        title: 'Dodge Ram Carousel',
        description: 'A Dodge Ram carousel concept focused on product storytelling, implemented with GPU-friendly transforms, modular slide state management, and lazy-loaded imagery to maintain smooth interaction on mobile and desktop inventory.',
        thumbPosition: 'center center',
        mediaType: 'html',
        size: {
            w: 1080,
            h: 1920
        },
        mediaSrc: workHtmlSrc('Dodge Ram Carousel/lighthouse.html')
    },
    {
        slug: 'fairlife',
        title: 'Coca-Cola Fairlife',
        description: 'An awareness campaign for Coca-Cola Fairlife. Utilizing a custom video animation and interactive elements to engage users.',
        thumbPosition: 'center center',
        thumbSrc: new URL('./assets/works/Fairlife/assets/milk-chocolate.png', import.meta.url).href,
        mediaType: 'html',
        size: {
            w: 1080,
            h: 1920
        },
        mediaSrc: workHtmlSrc('Fairlife/index.html')
    },
    {
        slug: 'gm-onstar',
        title: 'GM OnStar',
        description: 'A GM OnStar banner utilizing a custom carousel UI to display product features and benefits.',
        thumbPosition: '45% center',
        thumbSrc: new URL('./assets/works/GM Onstar/assets/970x250_Background_Lowerres.jpg', import.meta.url).href,
        mediaType: 'html',
        size: {
            w: 970,
            h: 250
        },
        mediaSrc: workHtmlSrc('GM OnStar/index.html')
    },
    {
        slug: 'healthcaregov',
        title: 'Healthcare.gov',
        description: 'A mobile full screen banner utilizing a slider to reveal effect.',
        thumbPosition: '90% center',
        thumbSrc: new URL('./assets/works/HealthcareGov/assets-lighthouse/Slider_-_Static_Image_720x1280_Week_1.jpg', import.meta.url).href,
        mediaType: 'html',
        size: {
            w: 1080,
            h: 1920
        },
        mediaSrc: workHtmlSrc('Healthcaregov/lighthouse.html')
    },
    {
        slug: 'home-depot-bathroom-game',
        title: 'Home Depot Bathroom Game',
        description: 'A Home Depot product-game concept designed around quick interaction loops, built with deterministic game state transitions, touch-safe input handling, and optimized asset packaging to balance playability with ad-serving constraints.',
        thumbPosition: '90% center',
        mediaType: 'html',
        size: {
            w: 970,
            h: 250
        },
        mediaSrc: workHtmlSrc('Home Depot Bathroom Game/index.html')
    },
    {
        slug: 'home-depot-game',
        title: 'Home Depot Closet Game',
        description: 'A multi-size playable campaign engineered to reuse core game logic across 970x250, 300x600, and 320x480 units, with size-specific layout adapters and shared event instrumentation for consistent analytics across formats.',
        thumbPosition: '90% center',
        mediaType: 'html',
        size: [{
            w: 970,
            h: 250
        }, {
            w: 300,
            h: 600
        }, {
            w: 320,
            h: 480
        }],
        mediaSrc: [
            workHtmlSrc('Home Depot Game/970x250.html'),
            workHtmlSrc('Home Depot Game/300x600.html'),
            workHtmlSrc('Home Depot Game/320x480.html')
        ]
    },
    {
        slug: 'kingsford-charcoal',
        title: 'Kingsford Charcoal',
        description: 'A dynamic weather-targeted banner that changes the messaging and image based on the weather conditions as well as specific user interest targeting.',
        thumbPosition: 'center center',
        thumbSrc: new URL('./assets/works/thumbnails/kingsford-charcoal.jpg', import.meta.url).href,
        mediaType: 'image',
        size: {
            w: 800,
            h: 800
        },
        mediaSrc: new URL('./assets/works/Kingsford Charcoal/Kingsford_Demo.jpg', import.meta.url).href
    },
    {
        slug: 'nordstrom',
        title: 'Nordstrom',
        description: 'A high-impact display campaign for Nordstrom. Utilizing a custom carousel UI to display products from their summer line.',
        thumbPosition: 'center 20%',
        thumbSrc: new URL('./assets/works/Nordstrom/assets/slide1.jpg', import.meta.url).href,
        mediaType: 'html',  
        size: {
            w: 970,
            h: 250
        },
        mediaSrc: workHtmlSrc('Nordstrom/index.html')
    },
    {
        slug: 'oceania-cruises',
        title: 'Oceania Cruises',
        description: 'A premium travel display concept for Oceania Cruises, developed as a modular HTML5 build with cinematic motion timing, compressed imagery, and timeline orchestration tuned for smooth playback in constrained ad environments.',
        thumbPosition: '80% center',
        mediaType: 'html',  
        size: {
            w: 970,
            h: 250
        },
        mediaSrc: workHtmlSrc('Oceania Cruises - 970x250/index.html')
    },
    {
        slug: 'ontario-lottery',
        title: 'Ontario Lottery',
        description: 'An animated banner that uses a custom GSAP animation to drive users to the Ontario Lottery. It also utilizes an API to show the current jackpot amount.',
        thumbPosition: '80% center',
        thumbSrc: new URL('./assets/works/Ontario Lottery/assets-horizon/bg-mobile.png', import.meta.url).href,
        mediaType: 'html',  
        size: {
            w: 1400,
            h: 315
        },
        mediaSrc: workHtmlSrc('Ontario Lottery/horizon.html')
    },
    {
        slug: 'seadoo-pins',
        title: 'Sea-Doo Pins',
        description: 'An interactive Sea-Doo hotspot experience that lets users explore feature callouts through pin-based interactions, implemented with explicit state mapping, layered click targets, and performance-first animation sequencing.',
        thumbPosition: '20% center',
        mediaType: 'html',
        size: {
            w: 970,
            h: 250
        },
        mediaSrc: workHtmlSrc('SeaDoo Pins/index.html')
    },
    {
        slug: 'tourism-charlevoix',
        title: 'Tourism Charlevoix',
        description: 'A Tourism Charlevoix awareness campaign. Utilized dynamically targeted imagery to showcase the beauty of the region.',
        thumbPosition: 'center center',
        thumbSrc: new URL('./assets/works/Tourism Charlevoix/images/hiking-01-300x600.jpg', import.meta.url).href,
        mediaType: 'html',
        size: {
            w: 300,
            h: 600
        },
        mediaSrc: workHtmlSrc('Tourism Charlevoix/index.html')
    },
    {
        slug: 'toyota-game',
        title: 'Toyota Game',
        description: 'A Toyota branded game unit featuring drag/drop mechanics and timed gameplay, built with robust hit-testing, progressive asset loading, and GSAP-driven animation choreography to keep interaction fluid under ad runtime limits.',
        thumbPosition: 'center 60%',
        mediaType: 'html',
        size: {
            w: 1080,
            h: 1920
        },
        mediaSrc: workHtmlSrc('Toyota Game/lighthouse.html')
    },
    {
        slug: 'wwf-butterflies',
        title: 'WWF Butterflies',
        description: 'A WWF awareness campaign built for multiple placements, using reusable creative modules, shared motion tokens, and adaptive composition rules so messaging stays cohesive while each format preserves visual impact.',
        thumbPosition: 'center center',
        mediaType: 'html',
        size: {
            w: 970,
            h: 250
        },
        mediaSrc: workHtmlSrc('WWF Butterflies/970x250.html')
    },
    {
        slug: 'wwf-quiz',
        title: 'WWF Quiz',
        description: 'A WWF quiz-based engagement unit in 300x600, implemented as a configurable question flow with tracked answer events, deterministic scoring logic, and compact UI state transitions optimized for narrow-rail ad inventory.',
        thumbPosition: 'center 75%',
        mediaType: 'html',
        size: {
            w: 300,
            h: 600
        },
        mediaSrc: workHtmlSrc('WWF Quiz - 300x600/index.html')
    },
    {
        slug: 'disney-3up',
        title: 'Disney 3up Campaign',
        description: 'A Disney+ multi-variant campaign system with art-directed static outputs and dynamic content hooks, produced with a reusable asset pipeline and strict size QA to ensure crisp rendering across all required placements.',
        thumbPosition: 'center center',
        mediaType: 'png',
        size: [
            { w: 300, h: 250 },
            { w: 300, h: 600 },
            { w: 970, h: 250 }
        ],
        mediaSrc: [
            new URL('./assets/works/Disney - 3up/disney-3up.png', import.meta.url).href,
            new URL('./assets/works/Disney - 3up/disney-3up-300x600.png', import.meta.url).href,
            new URL('./assets/works/Disney - 3up/disney-3up-970x250.png', import.meta.url).href
        ]
    },
    {
        slug: 'Pluto-TV',
        title: 'Pluto TV Dynamic Campaign',
        description: 'A Pluto TV dynamic video campaign blending motion graphics and template-driven messaging, exported with bitrate-conscious encoding and versioned delivery assets to keep playback reliable across publisher environments.',
        thumbPosition: 'center center',
        mediaType: 'video',
        size: [
            { w: 1920, h: 1080 }
        ],
        mediaSrc: [
            new URL('./assets/works/Pluto-TV/Pluto-TV.mp4', import.meta.url).href,
        ]
    },
    {
        slug: 'HBO-Righteous-Gemstones',
        title: 'HBO Righteous Gemstones Edge 2 Edge Campaign',
        description: 'An HBO Edge-to-Edge takeover campaign with dedicated mobile and desktop cuts, engineered with synchronized typography/motion systems and high-resolution video optimization to preserve quality while meeting ad platform limits.',
        thumbPosition: 'center center',
        mediaType: 'video',
        size: [
            { w: 1920, h: 1080 },
            { w: 1920, h: 1080 }
        ],
        mediaSrc: [
            new URL('./assets/works/HBO - Righteous Gemstones/mobile.mp4', import.meta.url).href,
            new URL('./assets/works/HBO - Righteous Gemstones/desktop.mp4', import.meta.url).href,
        ]
    }
]

const HEX_CORNER_CLASSES = [
    'work-card-trigger--hex-tl',
    'work-card-trigger--hex-tr',
    'work-card-trigger--hex-br',
    'work-card-trigger--hex-bl'
]

function workCardCornerClass(slug) {
    let n = 0
    for (let i = 0; i < slug.length; i += 1) {
        n = (n + slug.charCodeAt(i) * (i + 17)) % 997
    }
    return HEX_CORNER_CLASSES[n % 4]
}

const RASTER_MEDIA_TYPES = new Set(['image', 'png', 'jpeg', 'jpg', 'webp', 'gif'])

/** Tried in order for `public/assets/works/thumbnails/{slug}.<ext>` when no bundled thumb. */
const CAPTURED_THUMB_EXTENSIONS = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'avif', 'svg']

function publicThumbnailCandidates(slug) {
    const root = import.meta.env.BASE_URL
    const s = String(slug)
    const lower = s.toLowerCase()
    /** Prefer lowercase filenames; also try exact slug for `Pluto-TV.jpg`-style names on disk. */
    const bases = s === lower ? [s] : [lower, s]
    const urls = []
    for (const base of bases) {
        for (const ext of CAPTURED_THUMB_EXTENSIONS) {
            const u = `${root}assets/works/thumbnails/${base}.${ext}`
            if (!urls.includes(u)) urls.push(u)
        }
    }
    return urls
}

const MODAL_GALLERY_MS = 5500

function normalizeMediaSrc(mediaSrc) {
    if (Array.isArray(mediaSrc)) return mediaSrc.filter(Boolean)
    return mediaSrc ? [mediaSrc] : []
}

function getSlideSize(work, slideIndex) {
    const s = work.size
    if (Array.isArray(s) && s.length > 0) {
        const slide = s[slideIndex] ?? s[s.length - 1]
        return { w: Math.max(1, slide.w), h: Math.max(1, slide.h) }
    }
    if (s && typeof s.w === 'number' && typeof s.h === 'number') {
        return { w: Math.max(1, s.w), h: Math.max(1, s.h) }
    }
    return { w: 970, h: 600 }
}

function useGalleryAutoAdvance(length, intervalMs) {
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        if (length <= 1 || paused) return undefined
        const t = setInterval(() => {
            setIndex((i) => (i + 1) % length)
        }, intervalMs)
        return () => clearInterval(t)
    }, [length, intervalMs, paused])

    return { index, setIndex, pause: () => setPaused(true), resume: () => setPaused(false) }
}

/** First raster URL for the card thumb; multi-slide galleries only appear in the modal. */
function getRasterThumbSrc(item) {
    if (!RASTER_MEDIA_TYPES.has(item.mediaType)) return undefined
    const urls = normalizeMediaSrc(item.mediaSrc)
    if (urls.length === 0) return undefined
    return urls[0]
}

function getSrcFolderThumbnailUrl(slug) {
    const normalizeThumbKey = (value) =>
        String(value)
            .toLowerCase()
            .replace(/[\s_-]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')

    const key = normalizeThumbKey(slug)
    for (const [path, mod] of Object.entries(WORK_THUMBNAILS)) {
        const fileName = path.split('/').pop() ?? ''
        const stem = normalizeThumbKey(fileName.replace(/\.[^.]+$/i, ''))
        if (stem === key) {
            return typeof mod === 'string' ? mod : mod?.default
        }
    }
    return undefined
}

/** Raster media first, then `src/assets/works/thumbnails/{slug}.*`; else WorkThumb probes `public/assets/works/thumbnails/`. */
function getCardThumbSrc(item) {
    if (typeof item?.thumbSrc === 'string' && item.thumbSrc.length > 0) return item.thumbSrc
    return getRasterThumbSrc(item) ?? getSrcFolderThumbnailUrl(item.slug)
}

function WorkThumb({ slug, title, thumbSrc, thumbPosition, overlayTheme = 'default' }) {
    const bundled = typeof thumbSrc === 'string' ? thumbSrc : undefined
    const [bundledFailed, setBundledFailed] = useState(false)
    const [publicThumbUrl, setPublicThumbUrl] = useState(null)

    useEffect(() => {
        if (!bundled) return undefined
        const img = new Image()
        img.onload = () => setBundledFailed(false)
        img.onerror = () => setBundledFailed(true)
        img.src = bundled
        return undefined
    }, [bundled])

    useEffect(() => {
        if (bundled) return undefined
        let cancelled = false
        ;(async () => {
            for (const url of publicThumbnailCandidates(slug)) {
                if (cancelled) return
                const ok = await new Promise((resolve) => {
                    const img = new Image()
                    img.onload = () => resolve(true)
                    img.onerror = () => resolve(false)
                    img.src = url
                })
                if (cancelled) return
                if (ok) {
                    setPublicThumbUrl(url)
                    return
                }
            }
        })()
        return () => {
            cancelled = true
        }
    }, [bundled, slug])

    const displaySrc = bundled && !bundledFailed ? bundled : !bundled ? publicThumbUrl : null
    const thumbOk = Boolean(displaySrc)

    return (
        <div className="work-thumb">
            {thumbOk ? (
                <div
                    className="work-thumb-bg"
                    style={{
                        backgroundImage: `url("${displaySrc}")`,
                        backgroundPosition: thumbPosition || 'center center'
                    }}
                    aria-hidden="true"
                />
            ) : null}
            <span className="work-thumb-placeholder" aria-hidden="true" />
            <span className="work-thumb-initial" aria-hidden="true">
                {title.replace(/[^A-Za-z]/g, '').charAt(0) || '?'}
            </span>
            <div className={`work-thumb-overlay${overlayTheme === 'plugin' ? ' work-thumb-overlay--plugin' : ''}`}>
                <h4 className="work-card-title">{title}</h4>
            </div>
        </div>
    )
}

function useWorkModalSlotScale(intrinsicW, intrinsicH) {
    const slotRef = useRef(null)
    const [slotSize, setSlotSize] = useState({ w: 0, h: 0 })

    const iw = Math.max(1, Number(intrinsicW) || 970)
    const ih = Math.max(1, Number(intrinsicH) || 600)

    const measureSlot = useCallback(() => {
        const el = slotRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        setSlotSize({ w: r.width, h: r.height })
    }, [])

    useLayoutEffect(() => {
        measureSlot()
        const el = slotRef.current
        if (!el || typeof ResizeObserver === 'undefined') return undefined
        const ro = new ResizeObserver(measureSlot)
        ro.observe(el)
        return () => ro.disconnect()
    }, [measureSlot])

    const scale =
        slotSize.w > 0 && slotSize.h > 0
            ? Math.min(slotSize.w / iw, slotSize.h / ih, 1)
            : 1

    return { slotRef, scale, iw, ih }
}

function WorkModalScaledSlot({ intrinsicW, intrinsicH, children }) {
    const { slotRef, scale, iw, ih } = useWorkModalSlotScale(intrinsicW, intrinsicH)

    return (
        <div ref={slotRef} className="work-modal-iframe-slot">
            <div
                className="work-modal-iframe-scale-wrap"
                style={{
                    width: iw * scale,
                    height: ih * scale
                }}
            >
                {children({ scale, iw, ih })}
            </div>
        </div>
    )
}

function WorkModalIframe({ src, title, intrinsicW, intrinsicH }) {
    return (
        <WorkModalScaledSlot intrinsicW={intrinsicW} intrinsicH={intrinsicH}>
            {({ scale, iw, ih }) => (
                <iframe
                    className="work-modal-iframe work-modal-iframe--scaled"
                    src={src}
                    title={title}
                    style={{
                        width: iw,
                        height: ih,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left'
                    }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
            )}
        </WorkModalScaledSlot>
    )
}

function WorkModalFillIframe({ src, title }) {
    return (
        <div className="work-modal-iframe-slot">
            <iframe
                className="work-modal-iframe work-modal-iframe--fill"
                src={src}
                title={title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
        </div>
    )
}

function WorkModalResizableIframe({ src, title, initialW = 970, initialH = 600 }) {
    const wrapRef = useRef(null)
    const boxRef = useRef(null)
    const [frameSize, setFrameSize] = useState(null)

    useLayoutEffect(() => {
        const wrap = wrapRef.current
        if (!wrap) return
        const rect = wrap.getBoundingClientRect()
        const maxW = Math.max(240, Math.floor(rect.width))
        const maxH = Math.max(180, Math.floor(rect.height - 28))
        setFrameSize({
            w: Math.min(Math.max(320, Number(initialW) || 970), maxW),
            h: Math.min(Math.max(240, Number(initialH) || 600), maxH)
        })
    }, [initialW, initialH])

    useLayoutEffect(() => {
        const el = boxRef.current
        if (!el || typeof ResizeObserver === 'undefined') return undefined
        const ro = new ResizeObserver((entries) => {
            const next = entries[0]?.contentRect
            if (!next) return
            setFrameSize({
                w: Math.max(240, Math.round(next.width)),
                h: Math.max(180, Math.round(next.height))
            })
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    return (
        <div ref={wrapRef} className="work-modal-resizable-wrap">
            <div className="work-modal-resizable-hint">Drag bottom-right corner to resize preview</div>
            {frameSize ? (
                <div
                    ref={boxRef}
                    className="work-modal-resizable-box"
                    style={{ width: frameSize.w, height: frameSize.h }}
                >
                    <iframe
                        className="work-modal-iframe work-modal-iframe--resizable"
                        src={src}
                        title={title}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                </div>
            ) : null}
        </div>
    )
}

function WorkModalGallery({ work, urls }) {
    const { index, setIndex, pause, resume } = useGalleryAutoAdvance(urls.length, MODAL_GALLERY_MS)
    const n = urls.length
    const goPrev = useCallback(() => {
        setIndex((i) => (i - 1 + n) % n)
    }, [n, setIndex])
    const goNext = useCallback(() => {
        setIndex((i) => (i + 1) % n)
    }, [n, setIndex])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
            const tag = e.target?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
            if (e.target?.closest?.('video, iframe')) return
            e.preventDefault()
            if (e.key === 'ArrowLeft') goPrev()
            else goNext()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [goPrev, goNext])

    const src = urls[index]
    const { w, h } = getSlideSize(work, index)
    const slideLabel = `${work.title} (${index + 1} of ${urls.length})`

    let body
    if (work.mediaType === 'html') {
        body = (
            <WorkModalIframe key={src} src={src} title={slideLabel} intrinsicW={w} intrinsicH={h} />
        )
    } else if (work.mediaType === 'video') {
        body = (
            <WorkModalScaledSlot key={src} intrinsicW={w} intrinsicH={h}>
                {({ scale, iw, ih }) => (
                    <video
                        className="work-modal-video work-modal-video--scaled"
                        src={src}
                        controls
                        playsInline
                        preload="metadata"
                        style={{
                            width: iw,
                            height: ih,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left'
                        }}
                    />
                )}
            </WorkModalScaledSlot>
        )
    } else {
        body = (
            <WorkModalScaledSlot key={src} intrinsicW={w} intrinsicH={h}>
                {({ scale, iw, ih }) => (
                    <img
                        className="work-modal-image work-modal-image--scaled"
                        src={src}
                        alt={slideLabel}
                        style={{
                            width: iw,
                            height: ih,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left'
                        }}
                    />
                )}
            </WorkModalScaledSlot>
        )
    }

    return (
        <div className="work-modal-gallery" onMouseEnter={pause} onMouseLeave={resume}>
            <div
                className="work-modal-gallery-main"
                role="region"
                aria-label={`${work.title} gallery`}
            >
                <button
                    type="button"
                    className="work-modal-gallery-arrow work-modal-gallery-arrow--prev"
                    onClick={goPrev}
                    aria-label="Previous slide"
                >
                    <FaChevronLeft aria-hidden="true" />
                </button>
                <div className="work-modal-gallery-viewport">{body}</div>
                <button
                    type="button"
                    className="work-modal-gallery-arrow work-modal-gallery-arrow--next"
                    onClick={goNext}
                    aria-label="Next slide"
                >
                    <FaChevronRight aria-hidden="true" />
                </button>
            </div>
            <div className="work-modal-gallery-bullets" role="tablist" aria-label="Slides">
                {urls.map((u, bi) => (
                    <button
                        key={u}
                        type="button"
                        role="tab"
                        tabIndex={bi === index ? 0 : -1}
                        aria-selected={bi === index}
                        className={`work-modal-gallery-bullet${bi === index ? ' is-active' : ''}`}
                        onClick={() => setIndex(bi)}
                        aria-label={`Slide ${bi + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

function WorkModalMedia({ work }) {
    if (work?.pluginName) {
        const pluginKey = work.pluginName.toLowerCase()
        const src = resolveHtmlWorkSrc(work)
        if (pluginKey === 'sizemanager') {
            return <WorkModalResizableIframe src={src} title={`${work.title} resizable preview`} initialW={970} initialH={600} />
        }
        return <WorkModalIframe src={src} title={`${work.title} index preview`} intrinsicW={970} intrinsicH={600} />
    }
    const urls = normalizeMediaSrc(resolveHtmlWorkSrc(work))
    if (urls.length === 0) return null
    if (urls.length > 1) {
        return <WorkModalGallery key={work.slug} work={work} urls={urls} />
    }

    const src = urls[0]
    const { w, h } = getSlideSize(work, 0)

    if (work.mediaType === 'html') {
        if (work?.modalFill) {
            return <WorkModalFillIframe src={src} title={work.title} />
        }
        return <WorkModalIframe src={src} title={work.title} intrinsicW={w} intrinsicH={h} />
    }
    if (work.mediaType === 'video') {
        return (
            <WorkModalScaledSlot intrinsicW={w} intrinsicH={h}>
                {({ scale, iw, ih }) => (
                    <video
                        className="work-modal-video work-modal-video--scaled"
                        src={src}
                        controls
                        playsInline
                        preload="metadata"
                        style={{
                            width: iw,
                            height: ih,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left'
                        }}
                    />
                )}
            </WorkModalScaledSlot>
        )
    }
    return (
        <WorkModalScaledSlot intrinsicW={w} intrinsicH={h}>
            {({ scale, iw, ih }) => (
                <img
                    className="work-modal-image work-modal-image--scaled"
                    src={src}
                    alt={work.title}
                    style={{
                        width: iw,
                        height: ih,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left'
                    }}
                />
            )}
        </WorkModalScaledSlot>
    )
}

function WorkModal({ work, onClose }) {
    const titleId = useId()
    const closeRef = useRef(null)

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose()
        },
        [onClose]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeRef.current?.focus()
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = prevOverflow
        }
    }, [handleKeyDown])

    return createPortal(
        <div
            className="work-modal-backdrop"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="work-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    ref={closeRef}
                    type="button"
                    className="work-modal-close"
                    onClick={onClose}
                    aria-label="Close project preview"
                >
                    ×
                </button>
                <div className="work-modal-layout">
                    <div className="work-modal-media">
                        <div className="work-modal-media-fill">
                            <WorkModalMedia work={work} />
                        </div>
                    </div>
                    <aside className="work-modal-aside">
                        <h3 id={titleId} className="work-modal-title noto-serif">
                            {work.title}
                        </h3>
                        <p className="work-modal-description">{work.description}</p>
                        {work?.pluginName ? (
                            <p className="work-plugin-source-link-wrap">
                                <a
                                    className="work-plugin-source-link"
                                    href={pluginGithubUrl(work.pluginName)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View plugin source on GitHub
                                </a>
                            </p>
                        ) : null}
                    </aside>
                </div>
            </div>
        </div>,
        document.body
    )
}

function Work() {
    const [openWork, setOpenWork] = useState(null)

    return (
        <section className="work reveal-on-scroll" id="work">
            <div className="work-inner">
                <h3 className="noto-serif work-heading">Selected work</h3>
                <p className="work-intro">
                    A sample of interactive ads, games, and rich media—HTML, animation, and design working together.
                </p>
                <ul className="work-grid">
                    {works.map((item, index) => (
                        <li
                            className="work-card reveal-on-scroll"
                            key={item.slug}
                            style={{ transitionDelay: `${index * 10}ms` }}
                        >
                            <button
                                type="button"
                                className={`work-card-trigger ${workCardCornerClass(item.slug)}`}
                                onClick={() => setOpenWork(item)}
                            >
                                <WorkThumb
                                    slug={item.slug}
                                    title={item.title}
                                    thumbSrc={getCardThumbSrc(item)}
                                    thumbPosition={item.thumbPosition}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
                <UiUxExamplesSection
                    onOpenWork={setOpenWork}
                    workCardCornerClass={workCardCornerClass}
                    getCardThumbSrc={getCardThumbSrc}
                    WorkThumb={WorkThumb}
                />
                <PluginsSection
                    onOpenWork={setOpenWork}
                    workCardCornerClass={workCardCornerClass}
                    getCardThumbSrc={getCardThumbSrc}
                    WorkThumb={WorkThumb}
                />
            </div>
            {openWork ? (
                <WorkModal work={openWork} onClose={() => setOpenWork(null)} />
            ) : null}
        </section>
    )
}

export default Work
