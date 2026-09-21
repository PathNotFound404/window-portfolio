import { describe, it, expect, vi } from 'vitest'
import { loadProjects, validateProject } from '../loadProjects'

const valid = {
  name: 'Thing',
  summary: 'A thing.',
  tech: ['Vue'],
  repoUrl: 'https://github.com/me/thing',
}

describe('validateProject', () => {
  it('accepts a minimal project and one with every optional field', () => {
    expect(validateProject(valid)).toEqual([])
    expect(
      validateProject({
        ...valid,
        liveUrl: 'https://x.dev',
        order: 3,
        screenshot: '/p.png',
        icon: 'app',
      }),
    ).toEqual([])
  })

  it('reports each problem', () => {
    const errors = validateProject({
      name: '',
      tech: 'Vue',
      repoUrl: 'github.com/me/thing',
      liveUrl: 'nope',
      order: '1',
    })
    expect(errors).toEqual([
      'name is required',
      'summary is required',
      'tech must be an array of strings',
      'repoUrl must start with http:// or https://',
      'liveUrl must start with http:// or https://',
      'order must be a number',
    ])
  })

  it('rejects non-objects', () => {
    expect(validateProject(undefined)).toHaveLength(1)
  })
})

describe('loadProjects', () => {
  it('sorts by order, then name, and derives the slug from the filename', () => {
    const list = loadProjects({
      './projects/zed.js': { default: { ...valid, name: 'Zed' } },
      './projects/first.js': { default: { ...valid, name: 'First', order: 1 } },
      './projects/alpha.js': { default: { ...valid, name: 'Alpha' } },
    })
    expect(list.map((p) => p.name)).toEqual(['First', 'Alpha', 'Zed'])
    expect(list[0].slug).toBe('first')
  })

  it('skips invalid projects with a warning instead of throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const list = loadProjects({
      './projects/bad.js': { default: { name: 'Bad' } },
      './projects/good.js': { default: valid },
    })
    expect(list.map((p) => p.slug)).toEqual(['good'])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('bad.js'))
    warn.mockRestore()
  })
})

describe('project files in src/content/projects/', () => {
  const files = import.meta.glob(['../projects/*.js', '!../projects/_*.js'], { eager: true })

  it('finds at least the example projects', () => {
    expect(Object.keys(files).length).toBeGreaterThan(0)
  })

  it.each(Object.entries(files))('%s is valid', (_path, mod) => {
    expect(validateProject(mod.default)).toEqual([])
  })

  it('the template is valid too, so copying it always works', async () => {
    const { default: template } = await import('../projects/_template.js')
    expect(validateProject(template)).toEqual([])
  })
})
