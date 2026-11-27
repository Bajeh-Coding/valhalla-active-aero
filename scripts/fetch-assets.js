#!/usr/bin/env node
/**
 * Download chapter photography into public/images/.
 * Falls back gracefully when Unsplash CDN is blocked — the app also
 * uses the same CDN URLs as <img> fallbacks at runtime.
 *
 * HONESTY: these Unsplash stills are atmospheric stock, NOT official
 * Aston Martin Valhalla press assets. Prefer AM Media / press kit (P0).
 * See internal/cinematic-stage-handoff.md.
 */
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'images')

/** Local filename → Unsplash CDN source (full-bleed editorial stills). */
export const ASSET_MANIFEST = [
  {
    file: 'hero-valhalla.jpg',
    url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2400&q=85',
    alt: 'Dark hypercar hero — wind-tunnel editorial',
  },
  {
    file: 'side-aero.jpg',
    url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=2400&q=85',
    alt: 'Side profile — aero balance study',
  },
  {
    file: 'rear-wing.jpg',
    url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2400&q=85',
    alt: 'Rear wing / active aero focus',
  },
  {
    file: 'track-nurburgring.jpg',
    url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=2400&q=85',
    alt: 'Race track — Nürburgring GP context',
  },
]

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'valhalla-active-aero-asset-fetcher/1.0',
      Accept: 'image/jpeg,image/*,*/*',
    },
    redirect: 'follow',
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  if (!res.body) {
    throw new Error(`Empty body for ${url}`)
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest))
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  let ok = 0
  let failed = 0

  for (const asset of ASSET_MANIFEST) {
    const dest = join(OUT_DIR, asset.file)
    if (existsSync(dest)) {
      console.log(`skip  ${asset.file} (exists)`)
      ok += 1
      continue
    }
    try {
      process.stdout.write(`fetch ${asset.file} … `)
      await download(asset.url, dest)
      console.log('ok')
      ok += 1
    } catch (err) {
      failed += 1
      console.log('FAIL')
      console.warn(`  → ${err instanceof Error ? err.message : err}`)
      console.warn(`  → runtime will use Unsplash CDN fallback for ${asset.file}`)
    }
  }

  console.log(`\nDone: ${ok} ready, ${failed} failed (CDN fallback available).`)
  // Non-zero only if everything failed — local + CDN both needed for CI resilience.
  if (ok === 0 && ASSET_MANIFEST.length > 0) {
    process.exitCode = 1
  }
}

main()
