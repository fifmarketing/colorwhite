import Image from 'next/image'
import { BadgeCheck, MapPin, Star } from 'lucide-react'

interface TestimonialProps {
  name: string
  text: string
  rating: number
  /** Optional WhatsApp screenshot, already blurred by the admin before upload. */
  image?: string
  city?: string
  verified?: boolean
  dateLabel?: string
  source?: 'whatsapp' | 'website'
}

export function TestimonialCard({
  name,
  text,
  rating,
  image,
  city,
  verified,
  dateLabel,
  source,
}: TestimonialProps) {
  const showWhatsappBadge = verified !== false && (source === 'whatsapp' || Boolean(image))

  return (
    <figure className="flex flex-col bg-card rounded-3xl p-6 sm:p-8 shadow-luxury hover-lift">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: Math.max(1, Math.min(5, rating)) }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" aria-hidden="true" />
        ))}
        <span className="sr-only">{`${rating} out of 5 stars`}</span>
      </div>

      {image && (
        <a
          href={image}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-secondary/40 mb-5 cursor-pointer"
        >
          <Image
            src={image}
            alt={`Customer message from ${name}`}
            width={640}
            height={900}
            className="w-full h-auto max-h-96 object-contain"
          />
          <span className="sr-only">Open the full-size screenshot</span>
        </a>
      )}

      {text && (
        <blockquote className="text-foreground font-light leading-relaxed mb-6 text-pretty">
          &quot;{text}&quot;
        </blockquote>
      )}

      <figcaption className="mt-auto flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm font-light tracking-wide text-primary">— {name}</p>
          {city && (
            <span className="inline-flex items-center gap-1 text-xs font-light text-foreground/60">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {city}
            </span>
          )}
          {dateLabel && (
            <span className="text-xs font-light text-foreground/50">{dateLabel}</span>
          )}
        </div>

        {showWhatsappBadge && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-secondary px-3 py-1 text-[11px] font-light tracking-wide text-foreground/70">
            <BadgeCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            Verified WhatsApp Feedback
          </span>
        )}
      </figcaption>
    </figure>
  )
}
