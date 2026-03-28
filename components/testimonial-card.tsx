import { Star } from 'lucide-react'

interface TestimonialProps {
  name: string
  text: string
  rating: number
}

export function TestimonialCard({ name, text, rating }: TestimonialProps) {
  return (
    <div className="bg-card rounded-3xl p-8 shadow-luxury hover-lift">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-foreground font-light leading-relaxed mb-6 text-balance">
        &quot;{text}&quot;
      </p>
      <p className="text-sm font-light tracking-wide text-primary">— {name}</p>
    </div>
  )
}
