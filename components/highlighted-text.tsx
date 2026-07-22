import React from 'react'

// Renders text where words wrapped in *asterisks* get a highlight class.
// e.g. "Our *Complete* Collection" -> Our <span class="...">Complete</span> Collection
export function HighlightedText({
  text,
  highlightClass = 'gradient-gold',
}: {
  text: string
  highlightClass?: string
}) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <span key={i} className={highlightClass}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}
