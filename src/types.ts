export interface Jugador {
  id: number;
  alias: string;
  monedas: number;
}

export interface Sesion {
  token: string;
  jugador: Jugador;
}

export interface Categoria {
  clave: string;
  etiqueta: string;
}

export type EstadoDeSala = 'espera' | 'jugando' | 'resultados' | 'cerrada';
export type EstadoDeRonda = 'jugando' | 'cerrada' | 'finalizada';

export interface JugadorSala {
  id: number;
  alias: string;
  monedas: number;
  participa: boolean;
  enviado: boolean;
}

export interface Ronda {
  id: number;
  numero: number;
  letra: string;
  apuesta: number;
  pozo: number;
  estado: EstadoDeRonda;
  cerroAlias: string | null;
  categorias: Categoria[];
}

export interface RespuestaResultado {
  palabra: string;
  puntos: number;
}

export interface ResultadoJugador {
  id: number;
  alias: string;
  puntos: number;
  premio: number;
  ganador: boolean;
  respuestas: Record<string, RespuestaResultado>;
}

export interface Resultados {
  numero: number;
  letra: string;
  pozo: number;
  jugadores: ResultadoJugador[];
}

export interface EstadoSala {
  sala: {
    clave: string;
    estado: EstadoDeSala;
    anfitrionId: number;
  };
  yo: Jugador;
  jugadores: JugadorSala[];
  ronda: Ronda | null;
  misRespuestas: Record<string, string>;
  resultados: Resultados | null;
}
