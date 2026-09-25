/**
 * CrewPlate — the crew roster's identity avatar.
 *
 * A crew's seed draws its route diagram and the editor's face strip picks the
 * line colour. What is checked here is the whole of the component's own logic:
 * which colour a seed and a pin resolve to, that the pin changes ONLY the colour,
 * and that the render stays a decorative, local, non-draggable image.
 */
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CrewPlate, {
  crewPlateVariant,
  crewPlateVariantCount,
  djb2,
} from '../apps/issue-radar/components/StewardPlate'
import { ROUTE_LINES } from '../lib/routePlateAvatar'

function srcOf(seed: string, variant: number | null = null, size = 40): string {
  const { container, unmount } = render(<CrewPlate seed={seed} variant={variant} size={size} />)
  const src = container.querySelector('img')!.getAttribute('src')!
  unmount()
  return src
}

/** The plate's fill colour, read back out of the rendered data URI. */
function lineOf(seed: string, variant: number | null = null): string {
  const svg = decodeURIComponent(srcOf(seed, variant).replace(/^data:image\/svg\+xml;utf8,/, ''))
  const fill = /<g[^>]*><rect width="100" height="100" fill="(#[0-9a-f]{6})"/.exec(svg)
  expect(fill, 'plate rect').not.toBeNull()
  return fill![1]
}

describe('CrewPlate', () => {
  it('renders a decorative, local, non-draggable image', () => {
    const { container } = render(<CrewPlate seed="Whirlpool" size={38} />)
    const img = container.querySelector('img')!
    expect(img.getAttribute('src')!.startsWith('data:image/svg+xml')).toBe(true)
    expect(img).toHaveAttribute('aria-hidden', 'true')
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('draggable', 'false')
    expect(img).toHaveAttribute('width', '38')
  })

  it('shows the same plate for the same seed', () => {
    expect(srcOf('Whirlpool')).toBe(srcOf('Whirlpool'))
  })

  it('colours an unpinned plate by the face the seed hashes to', () => {
    for (const seed of ['Whirlpool', 'Sombrero', 'Bode', 'Carina']) {
      expect(lineOf(seed)).toBe(ROUTE_LINES[djb2(seed) % crewPlateVariantCount])
      expect(srcOf(seed)).toBe(srcOf(seed, crewPlateVariant(seed)))
    }
  })

  it('lets `variant` pin the colour and nothing else', () => {
    const seed = 'Sombrero'
    const plates = Array.from({ length: crewPlateVariantCount }, (_, i) => srcOf(seed, i))
    expect(new Set(plates).size).toBe(crewPlateVariantCount)
    plates.forEach((_, i) => expect(lineOf(seed, i)).toBe(ROUTE_LINES[i]))
    // Same route under every colour: the markup differs only in the fill values.
    const strip = (uri: string) =>
      decodeURIComponent(uri).replace(/#[0-9a-f]{6}/g, '')
    expect(new Set(plates.map(strip)).size).toBe(1)
  })

  it('treats variant 0 as a pin, not as "no variant"', () => {
    const seed = 'Bode'
    expect(lineOf(seed, 0)).toBe(ROUTE_LINES[0])
  })

  it('folds an out-of-range variant back onto the palette', () => {
    const n = crewPlateVariantCount
    expect(crewPlateVariant('x', n + 2)).toBe(2)
    expect(crewPlateVariant('x', -1)).toBe(n - 1)
    expect(crewPlateVariant('x', 3.7)).toBe(3)
    expect(crewPlateVariant('x', Number.NaN)).toBe(djb2('x') % n)
    expect(srcOf('Carina', n + 2)).toBe(srcOf('Carina', 2))
  })

  it('offers one face per line colour', () => {
    expect(crewPlateVariantCount).toBe(ROUTE_LINES.length)
  })
})

describe('djb2', () => {
  it('matches the hash the rest of the dashboard uses', () => {
    // Same algorithm as `gradientFor` (components/appstore/gradient.ts) and
    // `pickAnimal` (pages/scenes/WateringHoleScene.tsx). Exported so another
    // copy never gets written; these values pin it.
    expect(djb2('')).toBe(5381)
    expect(djb2('a')).toBe(177670)
    expect(djb2('crew-1')).not.toBe(djb2('crew-2'))
    // Unsigned 32-bit, so `% crewPlateVariantCount` can never be negative.
    for (const s of ['andromeda', 'bode', 'whirlpool', 'sombrero', '', 'crëw-ünïcode']) {
      expect(djb2(s)).toBeGreaterThanOrEqual(0)
      expect(djb2(s)).toBeLessThanOrEqual(0xffffffff)
    }
  })
})
