import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { colorSchemes, defaultScheme } from '../appearance'
import { backgrounds, defaultBackground } from '../backgrounds'
import { desktopIcons } from '../desktop'
import { windowDefaults } from '../windows'
import { apps } from '@/apps'
import { iconUrl } from '@/lib/icons'

// Pass a string (not a URL object): under jsdom, `new URL` isn't Node's URL class.
const here = dirname(fileURLToPath(import.meta.url))
const publicFile = (path) => resolve(here, '../../../public', `.${path}`)

describe('backgrounds', () => {
  it('have unique ids and the default exists', () => {
    const ids = backgrounds.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain(defaultBackground)
  })

  it.each(backgrounds.filter((b) => b.image))('$id points at a real file in public/', (bg) => {
    expect(bg.image.startsWith('/')).toBe(true)
    expect(existsSync(publicFile(bg.image))).toBe(true)
  })
})

describe('color schemes', () => {
  it('have unique ids and the default exists', () => {
    const ids = colorSchemes.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain(defaultScheme)
  })
})

describe('desktop icons', () => {
  it.each(desktopIcons)('$label has exactly one of app or url', (item) => {
    expect(Boolean(item.app) !== Boolean(item.url)).toBe(true)
  })

  it.each(desktopIcons.filter((item) => item.app))(
    '$label opens a registered app that has window defaults',
    (item) => {
      expect(apps).toHaveProperty(item.app)
      expect(windowDefaults).toHaveProperty(item.app)
    },
  )

  // iconUrl() silently falls back to the generic "app" icon, so a typo'd name would go unnoticed.
  it.each(desktopIcons.filter((item) => item.icon !== 'app'))(
    '$label uses an icon that exists in src/assets/icons/',
    (item) => {
      expect(iconUrl(item.icon)).not.toBe(iconUrl('app'))
    },
  )
})
