import { describe, it, expect } from 'vitest';
import { esHexValido, validarColores } from './colores';

describe('esHexValido', () => {
  it('acepta hex de 6 y de 3 dígitos, con mayúsculas o minúsculas', () => {
    expect(esHexValido('#e0355a')).toBe(true);
    expect(esHexValido('#F5F6FA')).toBe(true);
    expect(esHexValido('#fff')).toBe(true);
  });

  it('rechaza valores que no son hex', () => {
    expect(esHexValido('red')).toBe(false);
    expect(esHexValido('e0355a')).toBe(false);          // sin #
    expect(esHexValido('#e0355')).toBe(false);           // 5 dígitos
    expect(esHexValido('#e0355a; } body { x: url(')).toBe(false); // inyección
  });
});

describe('validarColores', () => {
  it('no lanza con colores válidos', () => {
    expect(() =>
      validarColores({ primario: '#e0355a', fondo: '#0f1117', texto: '#f5f6fa' }),
    ).not.toThrow();
  });

  it('lanza nombrando la clave inválida', () => {
    expect(() =>
      validarColores({ primario: 'rojo', fondo: '#0f1117', texto: '#f5f6fa' }),
    ).toThrow(/primario/);
  });
});
