import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Check } from 'lucide-react'

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              Our Story
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              About <span className="gradient-gold">Color White</span> Beauty
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-image.jpg"
                  alt="Color White Beauty Story"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 md:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-light tracking-tight text-foreground">
                  Our Mission
                </h2>
                <p className="text-lg font-light text-foreground/70 leading-relaxed text-balance">
                  At Color White Beauty, we believe that true luxury is about quality, authenticity, and results. Our mission is to provide premium skincare solutions that combine nature&apos;s finest ingredients with modern beauty science.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-light tracking-tight text-foreground">
                  Why Choose Us
                </h2>
                <div className="space-y-3">
                  {[
                    'Carefully selected, premium natural ingredients',
                    'Dermatologically tested and proven effective',
                    'Cruelty-free and ethically sourced',
                    'Scientifically formulated for all skin types',
                    'Luxury packaging with exceptional quality',
                  ].map((item, i) => (
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
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Quality',
                desc: 'Every product is crafted with meticulous attention to detail, ensuring the highest standards of excellence.',
              },
              {
                title: 'Natural Excellence',
                desc: 'We source the finest natural ingredients from around the world, combined with cutting-edge formulation.',
              },
              {
                title: 'Customer First',
                desc: 'Your satisfaction is our priority. We stand behind every product with our commitment to quality.',
              },
            ].map((value, i) => (
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
            Our Vision
          </h2>
          <p className="text-xl font-light text-foreground/70 leading-relaxed text-balance">
            We envision a world where premium skincare is accessible to everyone who desires it. By combining luxury with affordability, we&apos;re revolutionizing the beauty industry and empowering individuals to feel confident in their own skin.
          </p>
          <p className="text-xl font-light text-foreground/70 leading-relaxed text-balance">
            Each product in our collection is a promise—a promise of quality, efficacy, and the transformative power of self-care.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
