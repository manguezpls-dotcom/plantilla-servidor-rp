import { describe, it, expect } from 'vitest';
import { ctaEntrada } from './entrada';
import type { ConfigServidor } from '../config/servidor';

const base: ConfigServidor = {
  nombre: 'X', lema: 'y', descripcion: 'z', urlDiscord: 'https://discord',
  colores: { primario: '#111', fondo: '#222', texto: '#333' },
  caracteristicas: [], pasosEntrada: [], requiereWhitelist: true,
  staff: [], faq: [], creditoPlantilla: true,
};

describe('ctaEntrada', () => {
  it('con whitelist: "Solicitar plaza" apuntando al Discord', () => {
    expect(ctaEntrada(base)).toEqual({ texto: 'Solicitar plaza', url: 'https://discord' });
  });
  it('sin whitelist y con urlConexion: "Conectar" a la conexión', () => {
    expect(ctaEntrada({ ...base, requiereWhitelist: false, urlConexion: 'https://cfx' }))
      .toEqual({ texto: 'Conectar', url: 'https://cfx' });
  });
  it('sin whitelist y sin urlConexion: "Conectar" cae al Discord', () => {
    expect(ctaEntrada({ ...base, requiereWhitelist: false }))
      .toEqual({ texto: 'Conectar', url: 'https://discord' });
  });
});
