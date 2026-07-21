import type { ConfigServidor } from '../config/servidor';

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** ¿Es un color hex CSS válido (#abc o #aabbcc)? */
export function esHexValido(valor: string): boolean {
  return HEX.test(valor);
}

/**
 * Valida los colores de la config en build. Los colores se inyectan en un
 * <style> sin escapar (set:html), así que solo se admite hex estricto.
 * Lanza con mensaje claro para que el build falle si la config es inválida.
 */
export function validarColores(colores: ConfigServidor['colores']): void {
  const invalidas = (Object.entries(colores) as [string, string][])
    .filter(([, valor]) => !esHexValido(valor))
    .map(([clave]) => clave);
  if (invalidas.length > 0) {
    throw new Error(
      `Colores inválidos en src/config/servidor.ts (${invalidas.join(', ')}): ` +
        `usa hex tipo #aabbcc.`,
    );
  }
}
