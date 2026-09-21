import { loadProjects } from './loadProjects'

export { about } from './about'

// Auto-discovers every file in ./projects/ except those starting with "_".
export const projects = loadProjects(
  import.meta.glob(['./projects/*.js', '!./projects/_*.js'], { eager: true }),
)
