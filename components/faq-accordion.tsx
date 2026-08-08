'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FaqAccordionProps {
  items: { question: string; answer: string }[]
  idPrefix?: string
}

export function FaqAccordion({ items, idPrefix = 'faq' }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-2">
      {items.map((item, index) => (
        <AccordionItem key={`${idPrefix}-${index}`} value={`${idPrefix}-${index}`}>
          <AccordionTrigger className="text-left text-base font-light text-foreground hover:no-underline px-4">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <p className="text-sm font-light leading-relaxed text-foreground/70 text-pretty">
              {item.answer}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
