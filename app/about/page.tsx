import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HighlightedText } from '@/components/highlighted-text'
import { Check } from 'lucide-react'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function About() {
  const settings = await getSettings()
  const { aboutPage, footer } = settings

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              {aboutPage.heroEyebrow}
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              <HighlightedText text={aboutPage.heroTitle} />
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Video */}
            <div className="w-full">
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative w-full bg-black" style={{ paddingBottom: '100%' }}>
                  <video
                    src="/about-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-light tracking-tight text-foreground">
                  {aboutPage.missionTitle}
                </h2>
                <p className="text-lg font-light text-foreground/70 leading-relaxed text-balance">
                  {aboutPage.missionText}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-light tracking-tight text-foreground">
                  {aboutPage.whyChooseTitle}
                </h2>
                <div className="space-y-3">
                  {aboutPage.whyChoosePoints.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      </div>
                      <p className="text-foreground/70 font-light">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
              {aboutPage.valuesTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutPage.values.map((value, i) => (
              <div key={i} className="group hover-lift">
                <div className="bg-card rounded-3xl p-8 shadow-luxury h-full space-y-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                  <h3 className="text-2xl font-light tracking-tight text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-foreground/70 font-light leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            {aboutPage.visionTitle}
          </h2>
          {aboutPage.visionParagraphs.map((paragraph, i) => (
            <p key={i} className="text-xl font-light text-foreground/70 leading-relaxed text-balance">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <Footer {...footer} />
    </main>
  )
}
