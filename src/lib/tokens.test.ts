import { describe, it, expect } from 'vitest';
import { variablesTema, estiloInline } from './tokens';
import type { ConfigServidor } from '../config/servidor';

const base: ConfigServidor = {
  nombre: 'X', lema: 'y', descripcion: 'z', urlDiscord: 'https://d',
  colores: { primario: '#111111', fondo: '#222222', texto: '#333333' },
  caracteristicas: [], pasosEntrada: [], requiereWhitelist: false,
  staff: [], faq: [], creditoPlantilla: true,
};

describe('variablesTema', () => {
  it('mapea los tres colores a custom properties', () => {
    expect(variablesTema(base)).toEqual({
      '--color-primario': '#111111',
      '--color-fondo': '#222222',
      '--color-texto': '#333333',
    });
  });
});

describe('estiloInline', () => {
  it('serializa el mapa como declaraciones CSS separadas por ;', () => {
    expect(estiloInline({ '--a': '1', '--b': '2' })).toBe('--a: 1; --b: 2');
  });
});
