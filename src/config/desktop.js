import { site } from './site'

// Desktop icons, in display order (top to bottom, then wrapping to the next column).
// The Start menu is generated from this same list.
//
//   label      text under the icon
//   icon       filename (no extension) in src/assets/icons/
//   app        id of a window app registered in src/apps/index.js
//   url        opens in a new tab instead of a window (use `app` OR `url`)
//   startMenu  set to false to hide from the Start menu
export const desktopIcons = [
  { label: 'My Projects', icon: 'folder', app: 'projects' },
  { label: 'About Me', icon: 'notepad', app: 'about' },
  { label: 'Contact', icon: 'mail', app: 'contact' },
  { label: 'Resume', icon: 'document', url: site.links.resume },
  { label: 'GitHub', icon: 'github', url: site.links.github },
  { label: 'LinkedIn', icon: 'linkedin', url: site.links.linkedin },
  { label: 'Settings', icon: 'settings', app: 'settings' },
]
