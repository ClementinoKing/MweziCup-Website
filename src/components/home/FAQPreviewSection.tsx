import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

const faqs = [
  {
    question: 'How long can I wear mweziCup?',
    answer: 'mweziCup is designed for comfortable wear of up to 12 hours depending on your flow.',
  },
  {
    question: 'Is mweziCup safe?',
    answer: 'Yes. It is made from body-safe medical-grade silicone and designed for reusable period care.',
  },
  {
    question: 'Is it beginner friendly?',
    answer: 'Absolutely. We provide simple guides and support to make the learning curve easier.',
  },
  {
    question: 'Can I sleep with mweziCup?',
    answer: 'Yes, many users wear menstrual cups overnight for uninterrupted rest.',
  },
  {
    question: 'How long does one cup last?',
    answer: 'With proper care, a quality reusable menstrual cup can last for years.',
  },
];

export default function FAQPreviewSection() {
  return (
    <section className="section-gap bg-secondary/20">
      <div className="page-shell">
        <div className="mb-8 space-y-3">
          <Badge variant="soft" className="bg-secondary/80 text-primary">
            FAQs
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Quick answers for a smoother start.</h2>
        </div>
        <Card className="border-border/70 bg-white/90 px-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
}
