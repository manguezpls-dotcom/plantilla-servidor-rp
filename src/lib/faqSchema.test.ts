import { describe, it, expect } from 'vitest';
import { faqPageSchema } from './faqSchema';

describe('faqPageSchema', () => {
  it('genera un FAQPage con una Question por entrada', () => {
    const schema = faqPageSchema([
      { pregunta: '¿A?', respuesta: 'Sí.' },
      { pregunta: '¿B?', respuesta: 'No.' },
    ]);
    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: '¿A?', acceptedAnswer: { '@type': 'Answer', text: 'Sí.' } },
        { '@type': 'Question', name: '¿B?', acceptedAnswer: { '@type': 'Answer', text: 'No.' } },
      ],
    });
  });
  it('faq vacío: mainEntity vacío', () => {
    expect(faqPageSchema([])).toEqual({
      '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [],
    });
  });
});
