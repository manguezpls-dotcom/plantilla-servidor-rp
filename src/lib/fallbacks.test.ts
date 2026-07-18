import { describe, it, expect } from 'vitest';
import { tieneLogo, tieneImagenHero, gradienteHero } from './fallbacks';
import type { ConfigServidor } from '../config/servidor';

const base: ConfigServidor = {
  nombre: 'X', lema: 'y', descripcion: 'z', urlDiscord: 'https://d',
  colores: { primario: '#e0355a', fondo: '#0f1117', texto: '#fff' },
  caracteristicas: [], pasosEntrada: [], requiereWhitelist: false,
  staff: [], faq: [], creditoPlantilla: true,
};

describe('tieneLogo', () => {
  it('false cuando no hay logo', () => {
    expect(tieneLogo(base)).toBe(false);
  });
  it('false cuando el logo es cadena vacía o espacios', () => {
    expect(tieneLogo({ ...base, logo: '   ' })).toBe(false);
  });
  it('true cuando hay una ruta de logo', () => {
    expect(tieneLogo({ ...base, logo: '/logo.svg' })).toBe(true);
  });
});

describe('tieneImagenHero', () => {
  it('false cuando no hay imagen', () => {
    expect(tieneImagenHero(base)).toBe(false);
  });
  it('true cuando hay ruta de imagen', () => {
    expect(tieneImagenHero({ ...base, imagenHero: '/hero.jpg' })).toBe(true);
  });
});

describe('gradienteHero', () => {
  it('usa el color primario y el fondo en un linear-gradient', () => {
    expect(gradienteHero(base.colores)).toBe(
      'linear-gradient(135deg, #e0355a 0%, #0f1117 100%)'
    );
  });
});
