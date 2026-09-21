// Every .svg in src/assets/icons/ is available by filename (without extension).
// To add an icon: drop a file there and reference it by name in config or a project.
const files = import.meta.glob('../assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byName = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.svg$/, ''),
    url,
  ]),
)

export function iconUrl(name) {
  return byName[name] ?? byName.app
}
