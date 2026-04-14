/**
 * Captures viewport screenshots of each work HTML file for portfolio thumbnails.
 * Run: npm run capture-thumbnails
 * Requires: npx playwright install chromium (once)
 *
 * Serves public/assets (for /assets/libraries/*) and src/assets/works under /w/.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

const PORT = 9876
const VIEWPORT = { width: 900, height: 560 }
const OUT_DIR = path.join(projectRoot, 'public', 'assets', 'works', 'thumbnails')
const NAV_TIMEOUT_MS = 25_000
const SETTLE_MS = 2800

/** Paths relative to src/assets/works — must match Work.jsx entries */
const WORKS = [
    { slug: 'belvita-animated-banners', file: 'Belvita Animated Banners/index.html' },
    { slug: 'cinemark', file: 'Cinemark/index.html' },
    { slug: 'dominoes-stranger-things', file: 'Dominoes Stranger Things/index.html' },
    { slug: 'dodge-ram-carousel', file: 'Dodge Ram Carousel/lighthouse.html' },
    { slug: 'home-depot-bathroom-game', file: 'Home Depot Bathroom Game/index.html' },
    { slug: 'home-depot-game', file: 'Home Depot Game/970x250.html' },
    { slug: 'oceania-cruises', file: 'Oceania Cruises - 970x250/index.html' },
    { slug: 'seadoo-pins', file: 'SeaDoo Pins/index.html' },
    { slug: 'toyota-game', file: 'Toyota Game/lighthouse.html' },
    { slug: 'wwf-butterflies', file: 'WWF Butterflies/970x250.html' },
    { slug: 'wwf-quiz', file: 'WWF Quiz - 300x600/index.html' }
]

function contentType(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    const map = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm'
    }
    return map[ext] || 'application/octet-stream'
}

function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            try {
                const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)
                let pathname = decodeURIComponent(url.pathname)

                let filePath
                if (pathname.startsWith('/assets/')) {
                    filePath = path.join(projectRoot, 'public', pathname)
                } else if (pathname.startsWith('/w/')) {
                    const rel = pathname.slice(3)
                    filePath = path.join(projectRoot, 'src', 'assets', 'works', rel)
                } else if (pathname === '/' || pathname === '') {
                    res.writeHead(404)
                    res.end()
                    return
                } else {
                    res.writeHead(404)
                    res.end()
                    return
                }

                const normalized = path.normalize(filePath)
                const publicRoot = path.join(projectRoot, 'public')
                const worksRoot = path.join(projectRoot, 'src', 'assets', 'works')
                const inPublic = normalized.startsWith(publicRoot)
                const inWorks = normalized.startsWith(worksRoot)
                if (!inPublic && !inWorks) {
                    res.writeHead(403)
                    res.end()
                    return
                }

                if (!fs.existsSync(normalized) || fs.statSync(normalized).isDirectory()) {
                    res.writeHead(404)
                    res.end()
                    return
                }

                res.setHeader('Content-Type', contentType(normalized))
                fs.createReadStream(normalized).pipe(res)
            } catch {
                res.writeHead(500)
                res.end()
            }
        })

        server.listen(PORT, '127.0.0.1', () => resolve(server))
        server.on('error', reject)
    })
}

function workUrl(file) {
    const segments = file.split('/').map(encodeURIComponent).join('/')
    return `http://127.0.0.1:${PORT}/w/${segments}`
}

async function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true })

    const server = await startServer()
    const browser = await chromium.launch({ headless: true })

    try {
        for (const { slug, file } of WORKS) {
            const outPath = path.join(OUT_DIR, `${slug}.png`)
            const page = await browser.newPage({ viewport: VIEWPORT })
            try {
                await page.goto(workUrl(file), {
                    waitUntil: 'domcontentloaded',
                    timeout: NAV_TIMEOUT_MS
                })
                await new Promise((r) => setTimeout(r, SETTLE_MS))
                await page.screenshot({
                    path: outPath,
                    type: 'png',
                    fullPage: false
                })
                console.log('OK', slug, '->', path.relative(projectRoot, outPath))
            } catch (err) {
                console.error('FAIL', slug, err.message)
            } finally {
                await page.close()
            }
        }
    } finally {
        await browser.close()
        server.close()
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
