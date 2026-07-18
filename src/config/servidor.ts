// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE TU SERVIDOR
//  Este es el ÚNICO fichero que necesitas editar. Cambia los valores por los de
//  tu servidor, haz push y Cloudflare Pages publicará tu web.
//  Regla de oro: todo lo opcional degrada con elegancia. Si no rellenas una
//  sección, simplemente no se muestra; si no pones logo o imagen, se genera un
//  respaldo con tus colores. La plantilla nunca se ve "rota".
// ─────────────────────────────────────────────────────────────────────────────

export interface ConfigServidor {
  nombre: string;                    // "Leonida Roleplay"
  lema: string;                      // tagline corta del hero
  descripcion: string;               // meta description + bloque "sobre"
  urlDiscord: string;                // invitación permanente
  urlConexion?: string;              // cfx.re/join/xxxxx (opcional)
  colores: { primario: string; fondo: string; texto: string };  // hex
  logo?: string;                     // ruta en /public; fallback: wordmark tipográfico
  imagenHero?: string;               // ruta en /public; fallback: gradiente con el color primario
  caracteristicas: { titulo: string; texto: string }[];   // 3-6 tarjetas
  pasosEntrada: string[];            // "cómo entrar", 3-5 pasos
  requiereWhitelist: boolean;        // cambia el CTA: "Solicitar plaza" vs "Conectar"
  staff: { nombre: string; rol: string; avatar?: string }[];
  faq: { pregunta: string; respuesta: string }[];
  redes?: { x?: string; tiktok?: string; youtube?: string; instagram?: string };
  creditoPlantilla: boolean;         // footer "plantilla de VidaEnLeonida.com" (por defecto true)
}

export const servidor: ConfigServidor = {
  nombre: 'Leonida Roleplay',
  lema: 'Tu nueva vida en Leonida empieza aquí.',
  descripcion:
    'Servidor de rol serio de FiveM ambientado en Leonida. Historias que importan, ' +
    'economía viva y una comunidad que cuida cada personaje. Whitelist para garantizar calidad.',
  urlDiscord: 'https://discord.gg/leonidarp',
  urlConexion: 'https://cfx.re/join/abcd12',
  colores: {
    primario: '#e0355a',
    fondo: '#0f1117',
    texto: '#f5f6fa',
  },
  // logo e imagenHero se dejan sin definir: la demo muestra la degradación elegante.
  caracteristicas: [
    { titulo: 'Rol serio y whitelist', texto: 'Cada plaza pasa por una entrevista. Nada de RDM ni troleo: solo historias.' },
    { titulo: 'Economía viva', texto: 'Trabajos legales e ilegales, empresas de jugadores y un mercado que reacciona.' },
    { titulo: 'Facciones con historia', texto: 'Policía, sanitarios, prensa y bandas con tramas persistentes entre sesiones.' },
    { titulo: 'Staff presente', texto: 'Equipo activo 24/7 y tickets resueltos en minutos, no en días.' },
  ],
  pasosEntrada: [
    'Entra a nuestro Discord y lee las normas.',
    'Rellena la solicitud de whitelist y espera la entrevista.',
    'Instala FiveM y conéctate con el enlace directo.',
    'Crea tu personaje y empieza a rolear.',
  ],
  requiereWhitelist: true,
  staff: [
    { nombre: 'Álex', rol: 'Fundador' },
    { nombre: 'Marina', rol: 'Admin' },
    { nombre: 'Dario', rol: 'Soporte' },
  ],
  faq: [
    { pregunta: '¿Necesito experiencia previa en rol?', respuesta: 'No. Buscamos actitud, no currículum. Te ayudamos a empezar.' },
    { pregunta: '¿Cuánto tarda la whitelist?', respuesta: 'Normalmente 24-48 h desde que envías la solicitud.' },
    { pregunta: '¿Es gratis?', respuesta: 'Sí. Hay ventajas cosméticas opcionales que no dan ventaja de juego.' },
  ],
  redes: {
    x: 'https://x.com/leonidarp',
    tiktok: 'https://tiktok.com/@leonidarp',
    youtube: 'https://youtube.com/@leonidarp',
  },
  creditoPlantilla: true,
};
