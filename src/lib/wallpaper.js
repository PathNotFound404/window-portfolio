import { publicUrl } from './publicUrl'

// Inline CSS for an entry from src/config/backgrounds.js. Used by the desktop and the
// Settings preview so they always agree.
export function wallpaperStyle({ color, image, mode = 'cover' }) {
  const style = { backgroundColor: color }
  if (image) {
    style.backgroundImage = `url("${publicUrl(image)}")`
    style.backgroundPosition = 'center'
    style.backgroundRepeat = mode === 'tile' ? 'repeat' : 'no-repeat'
    style.backgroundSize = mode === 'cover' ? 'cover' : 'auto'
  }
  return style
}
