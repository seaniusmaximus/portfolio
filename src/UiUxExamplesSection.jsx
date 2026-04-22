const UI_UX_ASSET_FILES = import.meta.glob('./assets/works/ui-ux/*/assets/*')
const UI_UX_EXAMPLE_META = {
    'mortgage-calculator': {
        description: 'Interactive mortgage calculator with a clean, guided UI for testing payment scenarios. This was built for a big bank client to advertise their mortgage products. Initially the mortgage rates were set via an API to show real time rates. For this example rates are set statically via the slider UI.'
    }
}

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

function titleFromFolder(value) {
    return String(value)
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function buildUiUxWorks() {
    const seen = new Map()
    for (const key of Object.keys(UI_UX_ASSET_FILES)) {
        const match = key.match(/\/ui-ux\/([^/]+)\/assets\/[^/]+$/)
        if (!match) continue
        const folder = match[1]
        const lower = folder.toLowerCase()
        const customMeta = UI_UX_EXAMPLE_META[lower] ?? {}
        const title = customMeta.title ?? titleFromFolder(folder)
        const description = customMeta.description ?? `${titleFromFolder(folder)} UI/UX example.`
        if (seen.has(lower)) continue
        seen.set(lower, {
            slug: `ui-ux-${lower}`,
            title,
            description,
            thumbPosition: 'center center',
            thumbSrc: workHtmlSrc(`ui-ux/${folder}/thumb.png`),
            mediaType: 'html',
            modalFill: true,
            size: { w: 1440, h: 900 },
            mediaSrc: workHtmlSrc(`ui-ux/${folder}/index.html`)
        })
    }
    return [...seen.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export const uiUxWorks = buildUiUxWorks()

function UiUxExamplesSection({ onOpenWork, workCardCornerClass, getCardThumbSrc, WorkThumb }) {
    if (uiUxWorks.length === 0) return null

    return (
        <>
            <h4 className="noto-serif work-heading">UI-UX Examples</h4>
            <p className="work-intro">
                Interactive UI/UX examples from various projects.
            </p>
            <ul className="work-grid">
                {uiUxWorks.map((item, index) => (
                    <li
                        className="work-card reveal-on-scroll"
                        key={item.slug}
                        style={{ transitionDelay: `${index * 10}ms` }}
                    >
                        <button
                            type="button"
                            className={`work-card-trigger ${workCardCornerClass(item.slug)}`}
                            onClick={() => onOpenWork(item)}
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
        </>
    )
}

export default UiUxExamplesSection
