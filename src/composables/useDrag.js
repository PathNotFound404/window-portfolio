// Pointer-drag helper for moving and resizing windows.
//   onStart(event)          -> returns the origin state to measure from
//   onMove(dx, dy, origin)  -> called as the pointer moves
export function useDrag({ onStart, onMove, onEnd }) {
  function begin(event) {
    if (event.button !== 0) return

    event.preventDefault()
    const startX = event.clientX
    const startY = event.clientY
    const origin = onStart(event)

    const move = (e) => onMove(e.clientX - startX, e.clientY - startY, origin)
    const end = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      onEnd?.()
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
  }

  return { begin }
}
