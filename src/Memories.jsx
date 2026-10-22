import { useState, useRef } from 'react'

/* Every image dropped into src/memories/ is picked up automatically at build time,
   sorted by file name (01.jpg, 02.jpg, …). */
const found = import.meta.glob('./memories/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const PHOTOS = Object.entries(found)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, url]) => ({ url, name: path.split('/').pop() }))

export default function Memories() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const touchX = useRef(null)
  const count = PHOTOS.length

  const go = (step) => {
    if (count < 2) return
    setDir(step)
    setIndex(i => (i + step + count) % count)
  }

  const onTouchStart = e => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  const photo = count ? PHOTOS[index] : null

  return (
    <div className="sp-mem">
      <div className="sp-mem-row">
        <button type="button" className="sp-mem-nav" onClick={() => go(-1)}
          disabled={count < 2} aria-label="Previous photo">‹</button>

        <div className="sp-mem-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {/* Stack of frames behind the main one */}
          <div className="sp-mem-back sp-mem-back--2" aria-hidden="true" />
          <div className="sp-mem-back sp-mem-back--1" aria-hidden="true" />

          <div className="sp-mem-frame">
            {photo ? (
              <img
                key={photo.url}
                className="sp-mem-img"
                style={{ '--dir': dir }}
                src={photo.url}
                alt={`Memory ${index + 1} of ${count}`}
                decoding="async"
                draggable="false"
              />
            ) : (
              <div className="sp-mem-soon">
                <span className="sp-mem-soon-star">✦</span>
                <span className="sp-mem-soon-text">Coming Soon</span>
              </div>
            )}
          </div>
        </div>

        <button type="button" className="sp-mem-nav" onClick={() => go(1)}
          disabled={count < 2} aria-label="Next photo">›</button>
      </div>

      {photo && (
        <div className="sp-mem-footer">
          <span className="sp-mem-count">{index + 1} / {count}</span>
          <a className="sp-mem-download" href={photo.url} download={photo.name}>
            ↓ Download
          </a>
        </div>
      )}
    </div>
  )
}
