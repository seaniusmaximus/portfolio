/**
 * Crops uniform “whitespace” from the edges of each PNG in public/assets/works/thumbnails.
 * Uses Sharp’s trim: pixels similar to the top-left corner are removed from all sides.
 *
 * Run: npm run trim-thumbnails
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const THUMB_DIR = path.join(__dirname, '..', 'public', 'assets', 'works', 'thumbnails')

/** Allowed RGB distance from reference edge pixel (0–255 scale per channel); higher = trim more uniform border */
const TRIM_THRESHOLD = 28

async function main() {
    if (!fs.existsSync(THUMB_DIR)) {
        console.error('Missing folder:', THUMB_DIR)
        process.exit(1)
    }

    const files = fs.readdirSync(THUMB_DIR).filter((f) => f.toLowerCase().endsWith('.png'))
    if (files.length === 0) {
        console.log('No PNG files in', THUMB_DIR)
        return
    }

    for (const name of files) {
        const filePath = path.join(THUMB_DIR, name)
        const meta = await sharp(filePath).metadata()
        const out = await sharp(filePath)
            .trim({
                threshold: TRIM_THRESHOLD
            })
            .png()
            .toBuffer()

        const trimmed = await sharp(out).metadata()
        await fs.promises.writeFile(filePath, out)
        console.log(
            'OK',
            name,
            `(${meta.width}×${meta.height} → ${trimmed.width}×${trimmed.height})`
        )
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
