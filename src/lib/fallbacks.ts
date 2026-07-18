import type { ConfigServidor } from '../config/servidor';

/** ¿La config trae una ruta de logo utilizable? */
export function tieneLogo(config: ConfigServidor): boolean {
  return typeof config.logo === 'string' && config.logo.trim().length > 0;
}

/** ¿La config trae una imagen de hero utilizable? */
export function tieneImagenHero(config: ConfigServidor): boolean {
  return typeof config.imagenHero === 'string' && config.imagenHero.trim().length > 0;
}

/** Gradiente de respaldo cuando no hay imagen de hero: del primario al fondo. */
export function gradienteHero(colores: ConfigServidor['colores']): string {
  return `linear-gradient(135deg, ${colores.primario} 0%, ${colores.fondo} 100%)`;
}
