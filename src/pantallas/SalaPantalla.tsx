import { useCallback, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../api';
import Boton from '../componentes/Boton';
import { useEstadoSala } from '../hooks/useEstadoSala';
import { colores, comunes } from '../theme';
import { Jugador, Sesion } from '../types';
import JuegoPantalla from './JuegoPantalla';
import LobbyPantalla from './LobbyPantalla';
import ResultadosPantalla from './ResultadosPantalla';

interface Props {
  sesion: Sesion;
  clave: string;
  alSalir: () => void;
  alActualizarJugador: (jugador: Jugador) => void;
}

export default function SalaPantalla({ sesion, clave, alSalir, alActualizarJugador }: Props) {
  const { estado, sinConexion } = useEstadoSala(sesion.token, clave, alSalir);

  const yo = estado?.yo;
  const sala = estado?.sala.estado;
  const miParticipa = estado?.jugadores.find((j) => j.id === estado.yo.id)?.participa ?? false;

  useEffect(() => {
    if (yo) {
      alActualizarJugador(yo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yo?.monedas]);

  useEffect(() => {
    if (sala === 'cerrada') {
      alSalir();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sala]);

  const salirDeSala = useCallback(async () => {
    try {
      await api.salir(sesion.token, clave);
    } catch {
      // Si falla la red, igualmente se vuelve al menú.
    }
    alSalir();
  }, [sesion.token, clave, alSalir]);

  let contenido;
  if (!estado) {
    contenido = (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Text style={comunes.subtitulo}>Conectando con la sala...</Text>
      </View>
    );
  } else if (estado.sala.estado === 'jugando' && estado.ronda && !miParticipa) {
    contenido = (
      <View style={estilos.centro}>
        <Text style={comunes.titulo}>Ronda en curso</Text>
        <Text style={estilos.mensaje}>
          Usted no participa en esta ronda. Verá los resultados cuando termine.
        </Text>
        <Boton titulo="Salir de la sala" variante="secundario" onPress={salirDeSala} />
      </View>
    );
  } else if (estado.sala.estado === 'jugando' && estado.ronda) {
    contenido = (
      <JuegoPantalla
        key={estado.ronda.id}
        estado={estado}
        ronda={estado.ronda}
        token={sesion.token}
        clave={clave}
      />
    );
  } else if (estado.sala.estado === 'resultados' && estado.resultados && estado.ronda) {
    contenido = (
      <ResultadosPantalla
        estado={estado}
        resultados={estado.resultados}
        ronda={estado.ronda}
        token={sesion.token}
        clave={clave}
        alSalir={salirDeSala}
      />
    );
  } else {
    contenido = (
      <LobbyPantalla estado={estado} token={sesion.token} clave={clave} alSalir={salirDeSala} />
    );
  }

  return (
    <SafeAreaView style={comunes.pantalla}>
      {sinConexion && <Text style={estilos.aviso}>Sin conexión. Reintentando...</Text>}
      {contenido}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 24 },
  mensaje: { fontSize: 16, color: colores.textoSuave, textAlign: 'center' },
  aviso: {
    backgroundColor: colores.peligro,
    color: colores.blanco,
    textAlign: 'center',
    paddingVertical: 6,
    fontSize: 14,
  },
});
