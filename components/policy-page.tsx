import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import type { PolicyContent, SiteSettings } from '@/lib/default-content'

interface PolicyPageProps {
  policy: PolicyContent
  footer: SiteSettings['footer']
}

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }

/**
 * Turns the admin-editable plain text body into blocks.
 * "## " starts a heading, "- " starts a list item, blank lines split paragraphs.
 */
function parseBody(body: string): Block[] {
  const blocks: Block[] = []
  const lines = body.split('\n')
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: 'paragraph', text: paragraph.join(' ') })
      paragraph = []
    }
  }
  const flushList = () => {
    if (list.length > 0) {
      blocks.push({ kind: 'list', items: list })
      list = []
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }
    if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({ kind: 'heading', text: line.slice(3).trim() })
      continue
    }
    if (line.startsWith('- ')) {
      flushParagraph()
      list.push(line.slice(2).trim())
      continue
    }
    flushList()
    paragraph.push(line)
  }
  flushParagraph()
  flushList()

  return blocks
}

export function PolicyPage({ policy, footer }: PolicyPageProps) {
  const blocks = parseBody(policy.body ?? '')

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground text-balance">
              {policy.title}
            </h1>
            {policy.intro && (
              <p className="text-lg font-light leading-relaxed text-foreground/70 text-pretty">
                {policy.intro}
              </p>
            )}
          </div>
        </div>
      </section>

      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            {blocks.map((block, index) => {
              if (block.kind === 'heading') {
                return (
                  <h2
                    key={index}
                    className="text-xl md:text-2xl font-light tracking-wide text-foreground mt-6 first:mt-0"
                  >
                    {block.text}
                  </h2>
                )
              }
              if (block.kind === 'list') {
                return (
                  <ul key={index} className="flex flex-col gap-3 pl-5">
                    {block.items.map((item, i) => (
                      <li
                        key={i}
                        className="list-disc text-base font-light leading-relaxed text-foreground/75"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              }
              return (
                <p
                  key={index}
                  className="text-base font-light leading-relaxed text-foreground/75 text-pretty"
                >
                  {block.text}
                </p>
              )
            })}
          </div>
        </div>
      </article>

      <Footer {...footer} />
    </main>
  )
}
