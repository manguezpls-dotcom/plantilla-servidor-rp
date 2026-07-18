import type { ConfigServidor } from '../config/servidor';

export interface CtaEntrada {
  texto: string;
  url: string;
}

/** Texto y destino del CTA de entrada según el modelo del servidor. */
export function ctaEntrada(config: ConfigServidor): CtaEntrada {
  if (config.requiereWhitelist) {
    return { texto: 'Solicitar plaza', url: config.urlDiscord };
  }
  return { texto: 'Conectar', url: config.urlConexion ?? config.urlDiscord };
}
