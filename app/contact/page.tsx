import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export default function Contact() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              Get in Touch
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              Contact <span className="gradient-gold">Us</span>
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you. Reach out to us today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-light tracking-tight text-foreground">
                  Contact Information
                </h2>
                <p className="text-lg font-light text-foreground/70">
                  Reach out to us through any of these channels. We&apos;re here to help!
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex gap-4 group hover-lift">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-300 ease-out">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-light text-foreground mb-1">Email</p>
                    <a href="mailto:hello@colorwhite.pk" className="text-foreground/70 font-light hover:text-primary transition-all duration-300 ease-out">
                      hello@colorwhite.pk
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 group hover-lift">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-300 ease-out">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-light text-foreground mb-1">Phone</p>
                    <a href="tel:+923001234567" className="text-foreground/70 font-light hover:text-primary transition-all duration-300 ease-out">
                      +92 300 123 4567
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex gap-4 group hover-lift">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-300 ease-out">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-light text-foreground mb-1">WhatsApp</p>
                    <a href="https://wa.me/923001234567" className="text-foreground/70 font-light hover:text-primary transition-all duration-300 ease-out" target="_blank" rel="noopener noreferrer">
                      Chat with us
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4 group hover-lift">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-300 ease-out">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-light text-foreground mb-1">Address</p>
                    <p className="text-foreground/70 font-light">
                      Karachi, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-3xl p-8 shadow-luxury">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-6 py-3 rounded-2xl bg-secondary border border-border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-6 py-3 rounded-2xl bg-secondary border border-border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us what you'd like to know..."
                    rows={5}
                    className="w-full px-6 py-3 rounded-2xl bg-secondary border border-border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-full font-light tracking-wide hover:shadow-2xl transition-all duration-300 ease-out"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light tracking-tight text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is your return policy?',
                a: 'We offer a 30-day money-back guarantee on all products. If you&apos;re not satisfied, simply contact us for a full refund.',
              },
              {
                q: 'How long does shipping take?',
                a: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery.',
              },
              {
                q: 'Are your products suitable for all skin types?',
                a: 'Yes, our products are formulated to work with all skin types. However, we recommend starting with a patch test.',
              },
              {
                q: 'Do you offer international shipping?',
                a: 'Currently, we ship within Pakistan. International shipping options coming soon!',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-luxury-sm hover-lift">
                <h3 className="font-light text-foreground mb-2">{faq.q}</h3>
                <p className="text-foreground/70 font-light text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
