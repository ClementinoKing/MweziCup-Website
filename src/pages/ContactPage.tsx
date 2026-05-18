import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Seo from '@/components/seo/Seo';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
    
    // Show success message (you can add a toast notification here)
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-mwezi-hero via-mwezi-cream to-mwezi-soft py-20">
      <Seo
        title="Contact"
        description="Contact the Mwezi Cup team for product questions, wholesale enquiries, or support."
        path="/contact"
        keywords={['contact mwezi cup', 'wholesale menstrual cup', 'support']}
      />
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-mwezi-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-mwezi-soft/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mwezi-primary/5 blur-3xl" />
      </div>

      <div className="page-shell relative">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Get In Touch
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Have questions about Mwezi Cup? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Contact Card */}
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              {/* Contact Information Panel */}
              <div className="relative overflow-hidden bg-gradient-to-br from-mwezi-primary via-mwezi-deep to-mwezi-primary p-10 text-white lg:p-12">
                {/* Decorative Circle */}
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
                <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-white/5" />
                
                <div className="relative space-y-8">
                  <div>
                    <h2 className="mb-3 text-2xl font-bold">Contact Information</h2>
                    <p className="text-sm leading-relaxed text-white/80">
                      Reach out to us through any of these channels. We're here to support your journey to comfortable, sustainable period care.
                    </p>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Phone</div>
                        <a href="tel:+265888555900" className="mt-1 block font-medium hover:underline">
                          +265 888 555 900
                        </a>
                        <a href="tel:+265888555901" className="block text-sm text-white/80 hover:underline">
                          +265 888 555 901
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Email</div>
                        <a href="mailto:hello@mwezicup.com" className="mt-1 block font-medium hover:underline">
                          hello@mwezicup.com
                        </a>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Location</div>
                        <p className="mt-1 font-medium">Lilongwe, Malawi</p>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Office Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/80">Monday - Friday</span>
                        <span className="font-medium">8:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Saturday</span>
                        <span className="font-medium">9:00 AM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Sunday</span>
                        <span className="font-medium">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-10 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="h-12 rounded-xl border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-mwezi-primary/50 focus-visible:ring-mwezi-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="hello@example.com"
                        required
                        className="h-12 rounded-xl border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-mwezi-primary/50 focus-visible:ring-mwezi-primary/20"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Your Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      className="h-12 rounded-xl border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-mwezi-primary/50 focus-visible:ring-mwezi-primary/20"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write here your message ✍️"
                        required
                        rows={6}
                        className="w-full rounded-2xl border border-border/50 bg-muted/30 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus-visible:border-mwezi-primary/50 focus-visible:ring-2 focus-visible:ring-mwezi-primary/20"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-mwezi-primary to-mwezi-deep text-base font-semibold text-white shadow-lg shadow-mwezi-primary/25 transition-all hover:shadow-xl hover:shadow-mwezi-primary/30 disabled:opacity-50 sm:w-auto sm:px-12"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mx-auto mt-12 max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Quick Response */}
            <div className="rounded-3xl border-2 border-mwezi-primary/20 bg-white/80 p-6 backdrop-blur-sm">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mwezi-primary/10 to-mwezi-soft/30">
                <svg className="h-6 w-6 text-mwezi-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Quick Response</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours during business days.
              </p>
            </div>

            {/* Expert Support */}
            <div className="rounded-3xl border-2 border-mwezi-primary/20 bg-white/80 p-6 backdrop-blur-sm">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mwezi-primary/10 to-mwezi-soft/30">
                <svg className="h-6 w-6 text-mwezi-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Our team is knowledgeable and ready to help with any questions.
              </p>
            </div>

            {/* Secure & Private */}
            <div className="rounded-3xl border-2 border-mwezi-primary/20 bg-white/80 p-6 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mwezi-primary/10 to-mwezi-soft/30">
                <svg className="h-6 w-6 text-mwezi-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your information is safe with us and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
