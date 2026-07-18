import { describe, it, expect } from 'vitest';
import { redesActivas } from './redes';

describe('redesActivas', () => {
  it('sin redes: array vacío', () => {
    expect(redesActivas(undefined)).toEqual([]);
  });
  it('solo X: una entrada con etiqueta', () => {
    expect(redesActivas({ x: 'https://x.com/s' }))
      .toEqual([{ red: 'x', url: 'https://x.com/s', etiqueta: 'X' }]);
  });
  it('ignora cadenas vacías o de espacios', () => {
    expect(redesActivas({ x: '   ', youtube: 'https://yt' }))
      .toEqual([{ red: 'youtube', url: 'https://yt', etiqueta: 'YouTube' }]);
  });
  it('respeta el orden x → tiktok → youtube → instagram', () => {
    const r = redesActivas({
      instagram: 'https://ig', x: 'https://x', youtube: 'https://yt', tiktok: 'https://tt',
    });
    expect(r.map((e) => e.red)).toEqual(['x', 'tiktok', 'youtube', 'instagram']);
  });
});
