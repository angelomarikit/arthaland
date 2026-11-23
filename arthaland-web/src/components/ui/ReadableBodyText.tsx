type ReadableBodyTextProps = {
  children: string
  className?: string
}

function prepareReadableText(raw: string): string {
  let text = raw.replace(/\r\n/g, '\n').trim()
  const lineCount = (text.match(/\n/g)?.length ?? 0) + 1
  // Pasted marketing copy often has almost no line breaks — soften section joins.
  if (text.length > 280 && lineCount <= 2) {
    text = text.replace(/\.\s+-\s+/g, '.\n\n')
    text = text.replace(
      /\s+-\s+(?=(Unit Highlights|Unique Feature|What Makes|Floor:|Unit Type:|A Rare Opportunity))/gi,
      '\n\n',
    )
  }
  return text
}

/** Preserves line breaks from CMS textareas and splits blank-line gaps into paragraphs. */
export function ReadableBodyText({ children, className = '' }: ReadableBodyTextProps) {
  const text = prepareReadableText(children)
  if (!text) return null

  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

  if (paragraphs.length <= 1) {
    return (
      <div
        className={`leading-relaxed text-title-muted whitespace-pre-line ${className}`.trim()}
      >
        {text}
      </div>
    )
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 24)}`}
          className={`leading-relaxed text-title-muted whitespace-pre-line ${
            index > 0 ? 'mt-4' : ''
          }`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}