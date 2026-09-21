// Default title, size, and start position for each window app (keyed by app id).
// Positions are in pixels from the top-left of the desktop. Omit x/y to cascade.
export const windowDefaults = {
  projects: { title: 'My Projects', w: 560, h: 400, x: 90, y: 40 },
  about: { title: 'About Me - Notepad', w: 440, h: 320, x: 160, y: 70 },
  contact: { title: 'Contact', w: 340, h: 260, x: 220, y: 100 },
}

// Used for any app that has no entry above.
export const fallbackWindow = { title: 'Window', w: 400, h: 300 }

// Smallest size a window can be resized to.
export const minWindowSize = { w: 220, h: 120 }
