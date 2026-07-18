import type { ConfigServidor } from '../config/servidor';

/** Objeto JSON-LD schema.org FAQPage a partir del FAQ de la config. */
export function faqPageSchema(faq: ConfigServidor['faq']): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
    })),
  };
}
