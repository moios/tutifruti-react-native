import { useEffect, useRef, useState } from 'react';
import { api, ErrorApi } from '../api';
import { INTERVALO_MS } from '../config';
import { EstadoSala } from '../types';

interface Resultado {
  estado: EstadoSala | null;
  sinConexion: boolean;
}

// Consulta periódicamente el estado de la sala (polling).
// Si el servidor indica que el jugador ya no pertenece a la sala, llama a alPerder.
export function useEstadoSala(token: string, clave: string, alPerder: () => void): Resultado {
  const [estado, setEstado] = useState<EstadoSala | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const alPerderRef = useRef(alPerder);
  alPerderRef.current = alPerder;

  useEffect(() => {
    let activo = true;
    let enCurso = false;

    const consultar = async () => {
      if (enCurso) {
        return;
      }
      enCurso = true;
      try {
        const nuevo = await api.estado(token, clave);
        if (activo) {
          setEstado((previo) =>
            JSON.stringify(previo) === JSON.stringify(nuevo) ? previo : nuevo,
          );
          setSinConexion(false);
        }
      } catch (e) {
        if (!activo) {
          return;
        }
        if (e instanceof ErrorApi && e.codigo === 'fuera_de_sala') {
          alPerderRef.current();
        } else {
          setSinConexion(true);
        }
      } finally {
        enCurso = false;
      }
    };

    consultar();
    const id = setInterval(consultar, INTERVALO_MS);
    return () => {
      activo = false;
      clearInterval(id);
    };
  }, [token, clave]);

  return { estado, sinConexion };
}
