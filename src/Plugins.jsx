const PLUGIN_INDEX_FILES = import.meta.glob('./assets/works/Plugins/*/index.html')
const GITHUB_PLUGIN_BASE_URL = 'https://github.com/seaniusmaximus/plugins/tree/main'

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

function titleFromSlug(value) {
    return String(value)
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function pluginDescription(pluginName) {
    const key = String(pluginName).toLowerCase()
    if (key === 'particle') {
        return 'Config-driven particle emitter: tune count, image assets, size ranges, velocity/angle/gravity physics, delay, duration, and repeat behavior.'
    }
    if (key === 'profiler') {
        return 'Quiz/profile flow generator configured by JSON: define questions, options, weighted result mapping, and UI behavior like shuffle and navigation controls.'
    }
    if (key === 'sizemanager') {
        return 'Responsive state manager configured with breakpoints and aspect ratios; automatically switches classes and optionally scales/centers creative between states.'
    }
    return 'Standalone plugin module with a live index preview and source code available on GitHub.'
}

function pluginSvgMarkup(pluginName) {
    const key = String(pluginName).toLowerCase()
    if (key === 'particle') {
        return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#ffffff"/>
  <g fill="#111111" opacity="0.95">
    <circle cx="320" cy="200" r="10"/>
    <circle cx="260" cy="170" r="8"/>
    <circle cx="380" cy="170" r="8"/>
    <circle cx="245" cy="235" r="7"/>
    <circle cx="395" cy="235" r="7"/>
    <circle cx="320" cy="132" r="6"/>
    <circle cx="320" cy="268" r="6"/>
    <circle cx="205" cy="200" r="5"/>
    <circle cx="435" cy="200" r="5"/>
  </g>
  <text x="320" y="330" text-anchor="middle" fill="#202428" font-size="32" font-family="Arial, sans-serif" font-weight="700">PARTICLE</text>
</svg>`
    }
    if (key === 'profiler') {
        return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#ffffff"/>
  <rect x="190" y="90" width="260" height="180" rx="16" fill="none" stroke="#111111" stroke-width="10"/>
  <rect x="220" y="128" width="200" height="14" rx="7" fill="#111111"/>
  <circle cx="238" cy="174" r="10" fill="#111111"/>
  <rect x="258" y="166" width="150" height="14" rx="7" fill="#111111" opacity="0.92"/>
  <circle cx="238" cy="212" r="10" fill="#111111"/>
  <rect x="258" y="204" width="130" height="14" rx="7" fill="#111111" opacity="0.78"/>
  <text x="320" y="330" text-anchor="middle" fill="#202428" font-size="32" font-family="Arial, sans-serif" font-weight="700">PROFILER</text>
</svg>`
    }
    if (key === 'sizemanager') {
        return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#ffffff"/>
  <rect x="190" y="92" width="260" height="166" rx="14" fill="none" stroke="#111111" stroke-width="10"/>
  <path d="M190 110 H450" stroke="#111111" stroke-width="8"/>
  <path d="M212 240 L262 190" stroke="#111111" stroke-width="8" fill="none"/>
  <path d="M428 240 L378 190" stroke="#111111" stroke-width="8" fill="none"/>
  <path d="M320 252 L320 180" stroke="#111111" stroke-width="8" fill="none"/>
  <path d="M302 198 L320 180 L338 198" fill="none" stroke="#111111" stroke-width="8"/>
  <text x="320" y="330" text-anchor="middle" fill="#202428" font-size="32" font-family="Arial, sans-serif" font-weight="700">SIZE MANAGER</text>
</svg>`
    }
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#ffffff"/>
  <rect x="210" y="110" width="220" height="150" rx="16" fill="none" stroke="#111111" stroke-width="10"/>
  <text x="320" y="330" text-anchor="middle" fill="#202428" font-size="32" font-family="Arial, sans-serif" font-weight="700">PLUGIN</text>
</svg>`
}

function pluginThumbDataUrl(pluginName) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(pluginSvgMarkup(pluginName))}`
}

export function pluginGithubUrl(pluginName) {
    return `${GITHUB_PLUGIN_BASE_URL}/${encodeURIComponent(pluginName)}`
}

function getPluginWorks() {
    const seen = new Map()
    for (const key of Object.keys(PLUGIN_INDEX_FILES)) {
        const match = key.match(/\/Plugins\/([^/]+)\/index\.html$/)
        if (!match) continue
        const folder = match[1]
        const lower = folder.toLowerCase()
        if (seen.has(lower)) continue
        seen.set(lower, {
            slug: `plugin-${lower}`,
            title: `${titleFromSlug(folder)} Plugin`,
            description: pluginDescription(folder),
            thumbPosition: 'center center',
            thumbSrc: pluginThumbDataUrl(folder),
            mediaType: 'html',
            size: { w: 970, h: 600 },
            mediaSrc: workHtmlSrc(`Plugins/${folder}/index.html`),
            pluginName: folder
        })
    }
    return [...seen.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export const pluginWorks = getPluginWorks()

function PluginsSection({ onOpenWork, workCardCornerClass, getCardThumbSrc, WorkThumb }) {
    if (pluginWorks.length === 0) return null

    return (
        <>
            <h4 className="noto-serif work-heading">Plugins</h4>
            <p className="work-intro">
                Standalone plugin modules created to support rich media builds. Each plugin was designed to be able to slot into any rich media build and be used as a standalone module or part of a larger creative system by developers by using their config to drive a custom HTML element.
            </p>
            <ul className="work-grid work-grid--plugins">
                {pluginWorks.map((item, index) => (
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
                                thumbSrc={item.thumbSrc ?? getCardThumbSrc(item)}
                                thumbPosition={item.thumbPosition}
                                overlayTheme="plugin"
                            />
                        </button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default PluginsSection
