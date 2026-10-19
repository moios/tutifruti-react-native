import { API_URL } from './config';
import { EstadoSala, Jugador } from './types';

export class ErrorApi extends Error {
  codigo: string;

  constructor(mensaje: string, codigo: string = 'error') {
    super(mensaje);
    this.codigo = codigo;
  }
}

export function mensajeDe(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

async function llamar<T>(accion: string, cuerpo: object): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 8000);
  try {
    const respuesta = await fetch(`${API_URL}?accion=${accion}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
      signal: controlador.signal,
    });
    const datos = await respuesta.json();
    if (!datos.ok) {
      throw new ErrorApi(datos.error ?? 'Error desconocido del servidor.', datos.codigo ?? 'error');
    }
    return datos as T;
  } catch (e) {
    if (e instanceof ErrorApi) {
      throw e;
    }
    throw new ErrorApi('No se pudo conectar con el servidor.', 'red');
  } finally {
    clearTimeout(temporizador);
  }
}

export const api = {
  registrar: (alias: string) =>
    llamar<{ token: string; jugador: Jugador }>('registrar', { alias }),

  perfil: (token: string) => llamar<{ jugador: Jugador }>('perfil', { token }),

  crearSala: (token: string) => llamar<{ clave: string }>('crear_sala', { token }),

  unirse: (token: string, clave: string) => llamar<{ clave: string }>('unirse', { token, clave }),

  salir: (token: string, clave: string) => llamar<object>('salir', { token, clave }),

  estado: async (token: string, clave: string): Promise<EstadoSala> => {
    const r = await llamar<{ estado: EstadoSala }>('estado', { token, clave });
    return r.estado;
  },

  iniciarRonda: (token: string, clave: string, apuesta: number) =>
    llamar<object>('iniciar_ronda', { token, clave, apuesta }),

  guardar: (token: string, clave: string, respuestas: Record<string, string>) =>
    llamar<object>('guardar', { token, clave, respuestas }),

  enviar: (token: string, clave: string, respuestas: Record<string, string>) =>
    llamar<object>('enviar', { token, clave, respuestas }),

  tutifruti: (token: string, clave: string, respuestas: Record<string, string>) =>
    llamar<object>('tutifruti', { token, clave, respuestas }),
};
