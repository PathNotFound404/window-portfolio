// Desktop background choices shown in Settings > Background.
//
// To add one: drop the image in public/backgrounds/ and add a line below.
//   id     unique key, saved in the visitor's browser
//   name   label in the Settings list
//   image  path under public/ (must start with "/")
//   color  shown behind the image while it loads (an image-less entry is just this color)
//   mode   optional: 'cover' (default) | 'tile' | 'center'
export const backgrounds = [
  { id: 'teal', name: 'Teal', image: '/backgrounds/98BG-Teal.jpg', color: '#008688' },
  { id: 'green', name: 'Green', image: '/backgrounds/98BG-Green.jpg', color: '#188800' },
  { id: 'red', name: 'Red', image: '/backgrounds/98BG-Red.jpg', color: '#882600' },
]

// Used on a first visit, and if a saved choice no longer exists.
export const defaultBackground = 'teal'
