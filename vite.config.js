import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Preserve full `src/assets/works/` structure in production output. */
function copyWorkFolders() {
    const toPosixPath = (value) => value.replace(/\\/g, '/')

    function rewriteLibraryLinks(rootDir) {
        const stack = [rootDir]
        const librariesDir = path.resolve('dist', 'assets', 'libraries')
        while (stack.length > 0) {
            const current = stack.pop()
            for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
                const fullPath = path.join(current, entry.name)
                if (entry.isDirectory()) {
                    stack.push(fullPath)
                    continue
                }
                if (!entry.isFile() || !entry.name.endsWith('.html')) continue
                const relativeToLibraries = path.relative(path.dirname(fullPath), librariesDir)
                let prefix = toPosixPath(relativeToLibraries)
                if (!prefix.startsWith('.')) prefix = `./${prefix}`
                if (!prefix.endsWith('/')) prefix = `${prefix}/`
                const before = fs.readFileSync(fullPath, 'utf8')
                const after = before
                    .replace(/src=(["'])\/assets\/libraries\//g, `src=$1${prefix}`)
                    .replace(/href=(["'])\/assets\/libraries\//g, `href=$1${prefix}`)
                if (after !== before) fs.writeFileSync(fullPath, after)
            }
        }
    }

    return {
        name: 'copy-work-folders',
        closeBundle() {
            const srcDir = path.resolve('src', 'assets', 'works')
            const outDir = path.resolve('dist', 'assets', 'works')
            if (!fs.existsSync(srcDir)) return
            fs.rmSync(outDir, { recursive: true, force: true })
            fs.cpSync(srcDir, outDir, { recursive: true })
            rewriteLibraryLinks(outDir)
        }
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), copyWorkFolders()],
    /** Relative asset paths so `dist/index.html` works from disk (`file://`) and subpath deploys. */
    base: './'
})
