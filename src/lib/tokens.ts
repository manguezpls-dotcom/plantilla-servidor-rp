import type { ConfigServidor } from '../config/servidor';

/** Custom properties CSS derivadas de los colores de la config. */
export function variablesTema(config: ConfigServidor): Record<string, string> {
  return {
    '--color-primario': config.colores.primario,
    '--color-fondo': config.colores.fondo,
    '--color-texto': config.colores.texto,
  };
}

/** Serializa un mapa de variables como declaraciones CSS: "--a: 1; --b: 2". */
export function estiloInline(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([clave, valor]) => `${clave}: ${valor}`)
    .join('; ');
}
