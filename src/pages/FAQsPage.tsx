import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Seo from '@/components/seo/Seo';

const faqs = [
  { question: 'How long can I wear mweziCup?', answer: 'Up to 12 hours depending on your flow and comfort.' },
  { question: 'Is mweziCup safe?', answer: 'Yes, it is designed from body-safe medical-grade silicone.' },
  { question: 'Is it beginner friendly?', answer: 'Yes. The brand experience is built around support and simple guidance.' },
  { question: 'Can I sleep with mweziCup?', answer: 'Yes, it is suitable for overnight wear for many users.' },
  { question: 'How long does one cup last?', answer: 'With proper care, a reusable cup can last for years.' },
];

export default function FAQsPage() {
  return (
    <section className="section-gap">
      <Seo
        title="FAQs"
        description="Get answers about Mwezi Cup comfort, safety, wear time, cleaning, and reuse."
        path="/faqs"
        keywords={['Mwezi Cup FAQs', 'menstrual cup safety', 'how long to wear menstrual cup']}
      />
      <div className="page-shell space-y-10">
        <PageHeader
          eyebrow="FAQs"
          title="Answers to the questions people ask most."
          subtitle="A polished placeholder FAQ page for deeper help content later."
        />
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
