'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, MessageCircle, Loader } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send message')

      toast.success('Send Message', {
        description: "Message sent successfully! We'll get back to you soon.",
        duration: 3000,
      })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to Send', {
        description: 'Please try again or contact us directly.',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              Let&apos;s Connect
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground text-balance">
              We&apos;d Love to <span className="font-semibold text-primary">Hear</span> From You
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto">
              Have questions about our products? Need personalized recommendations? We&apos;re here to help and would love to connect with you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                  Contact Information
                </h2>
                <p className="text-lg font-light text-foreground/70 max-w-xl">
                  Reach out through your preferred channel. Our team responds quickly and is always happy to assist.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 ease-out">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-light text-foreground text-lg mb-1">Email</p>
                    <a href="mailto:Sm9626157@gmail.com" className="text-foreground/70 font-light hover:text-primary transition-all duration-300 ease-out cursor-pointer">
                      Sm9626157@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 ease-out">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-light text-foreground text-lg mb-1">Phone</p>
                    <a href="tel:+923007222669" className="text-foreground/70 font-light hover:text-primary transition-all duration-300 ease-out cursor-pointer">
                      +92 300 7222669
                    </a>
                  </div>
                </div>

              

                {/* Address */}
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 ease-out">
                    <MapPin className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-light text-foreground text-lg mb-1">Address</p>
                    <p className="text-foreground/70 font-light">
                     10-H Afghani Road, Samanabad, Lahore, 54000, Punjab, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-card rounded-3xl p-10 shadow-2xl">
                <h3 className="text-2xl font-light text-foreground mb-8">Send us a Message</h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={`w-full px-5 py-3 rounded-2xl bg-secondary/50 border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out ${
                        errors.name ? 'border-red-300 focus:ring-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-light">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full px-5 py-3 rounded-2xl bg-secondary/50 border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out ${
                        errors.email ? 'border-red-300 focus:ring-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-light">{errors.email}</p>}
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2">
                      Phone Number <span className="text-foreground/50">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 123 4567"
                      className="w-full px-5 py-3 rounded-2xl bg-secondary/50 border border-border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className={`w-full px-5 py-3 rounded-2xl bg-secondary/50 border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out ${
                        errors.subject ? 'border-red-300 focus:ring-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1 font-light">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us everything..."
                      rows={5}
                      className={`w-full px-5 py-3 rounded-2xl bg-secondary/50 border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out resize-none ${
                        errors.message ? 'border-red-300 focus:ring-red-500' : 'border-border focus:border-primary'
                      }`}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1 font-light">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-full font-light tracking-wide hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

  

      <Footer />
      <Toaster />
    </main>
  )
}
