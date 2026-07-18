import type { ConfigServidor } from '../config/servidor';

export interface RedActiva {
  red: string;
  url: string;
  etiqueta: string;
}

const ORDEN: { clave: keyof NonNullable<ConfigServidor['redes']>; etiqueta: string }[] = [
  { clave: 'x', etiqueta: 'X' },
  { clave: 'tiktok', etiqueta: 'TikTok' },
  { clave: 'youtube', etiqueta: 'YouTube' },
  { clave: 'instagram', etiqueta: 'Instagram' },
];

/** Redes con URL utilizable, en orden fijo. Degrada a [] si no hay ninguna. */
export function redesActivas(redes: ConfigServidor['redes']): RedActiva[] {
  if (!redes) return [];
  return ORDEN
    .filter(({ clave }) => {
      const url = redes[clave];
      return typeof url === 'string' && url.trim().length > 0;
    })
    .map(({ clave, etiqueta }) => ({ red: clave, url: redes[clave]!, etiqueta }));
}
