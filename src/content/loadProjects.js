// Turns the files in src/content/projects/ into the sorted project list.
// Files starting with "_" (like _template.js) are ignored.
// Add a project by adding a file there; nothing here needs to change.

const isUrl = (value) => typeof value === 'string' && /^https?:\/\//.test(value)

// Returns a list of problems; an empty list means the project is valid.
export function validateProject(project) {
  if (!project || typeof project !== 'object') return ['default export must be an object']

  const errors = []
  if (typeof project.name !== 'string' || !project.name) errors.push('name is required')
  if (typeof project.summary !== 'string' || !project.summary) errors.push('summary is required')
  if (!Array.isArray(project.tech) || project.tech.some((t) => typeof t !== 'string')) {
    errors.push('tech must be an array of strings')
  }
  if (!isUrl(project.repoUrl)) errors.push('repoUrl must start with http:// or https://')
  if (project.liveUrl != null && !isUrl(project.liveUrl)) {
    errors.push('liveUrl must start with http:// or https://')
  }
  if (project.order != null && typeof project.order !== 'number')
    errors.push('order must be a number')
  return errors
}

// `modules` is the result of import.meta.glob(..., { eager: true }).
export function loadProjects(modules) {
  const projects = []

  for (const [path, mod] of Object.entries(modules)) {
    const errors = validateProject(mod.default)
    if (errors.length) {
      console.warn(`[projects] Skipping ${path}: ${errors.join('; ')}`)
      continue
    }
    const slug = path.split('/').pop().replace(/\.js$/, '')
    projects.push({ slug, ...mod.default })
  }

  return projects.sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name),
  )
}
