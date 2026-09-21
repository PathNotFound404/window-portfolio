import { describe, it, expect } from 'vitest'
import { publicUrl } from '../publicUrl'
import { wallpaperStyle } from '../wallpaper'

describe('publicUrl', () => {
  it('resolves public paths against the base URL', () => {
    expect(publicUrl('/backgrounds/x.jpg')).toBe(`${import.meta.env.BASE_URL}backgrounds/x.jpg`)
  })

  it('leaves absolute urls and empty values alone', () => {
    expect(publicUrl('https://example.com/a.png')).toBe('https://example.com/a.png')
    expect(publicUrl('mailto:me@example.com')).toBe('mailto:me@example.com')
    expect(publicUrl(undefined)).toBeUndefined()
  })
})

describe('wallpaperStyle', () => {
  it('uses just the color when there is no image', () => {
    expect(wallpaperStyle({ color: '#008080' })).toEqual({ backgroundColor: '#008080' })
  })

  it('covers with an image by default and tiles on request', () => {
    const cover = wallpaperStyle({ color: '#000', image: '/backgrounds/a.jpg' })
    expect(cover.backgroundSize).toBe('cover')
    expect(cover.backgroundImage).toContain('backgrounds/a.jpg')

    const tile = wallpaperStyle({ color: '#000', image: '/backgrounds/a.jpg', mode: 'tile' })
    expect(tile.backgroundRepeat).toBe('repeat')
  })
})
