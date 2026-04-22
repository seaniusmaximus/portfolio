import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const uiUxRoot = path.join(projectRoot, 'src', 'assets', 'works', 'ui-ux')

function toPosix(value) {
    return value.replace(/\\/g, '/')
}

function walkIndexFiles(dirPath, out = []) {
    if (!fs.existsSync(dirPath)) return out
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
        const abs = path.join(dirPath, entry.name)
        if (entry.isDirectory()) {
            walkIndexFiles(abs, out)
            continue
        }
        if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
            out.push(abs)
        }
    }
    return out
}

function normalizeHtmlAssetPaths(html) {
    // Vite exports often point to "/assets/*". In nested iframe previews we need "./assets/*".
    return html.replace(/((?:src|href)\s*=\s*["'])\/assets\//gi, '$1./assets/')
}

function main() {
    const files = walkIndexFiles(uiUxRoot)
    if (files.length === 0) {
        console.log('No ui-ux index.html files found.')
        return
    }

    let changedCount = 0
    for (const filePath of files) {
        const before = fs.readFileSync(filePath, 'utf8')
        const after = normalizeHtmlAssetPaths(before)
        if (after === before) continue
        fs.writeFileSync(filePath, after, 'utf8')
        changedCount += 1
        console.log('Updated', toPosix(path.relative(projectRoot, filePath)))
    }

    if (changedCount === 0) {
        console.log('UI-UX index paths already normalized.')
    } else {
        console.log(`Normalized ${changedCount} file(s).`)
    }
}

main()
