import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { api, mensajeDe } from '../api';
import Boton from '../componentes/Boton';
import Cabecera from '../componentes/Cabecera';
import Chip from '../componentes/Chip';
import { APUESTAS } from '../config';
import { colores, comunes } from '../theme';
import { EstadoSala } from '../types';

interface Props {
  estado: EstadoSala;
  token: string;
  clave: string;
  alSalir: () => void;
}

export default function LobbyPantalla({ estado, token, clave, alSalir }: Props) {
  const [apuesta, setApuesta] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esAnfitrion = estado.sala.anfitrionId === estado.yo.id;
  const habilitados = estado.jugadores.filter((j) => j.monedas >= apuesta);
  const puedeIniciar = esAnfitrion && habilitados.length >= 2 && estado.yo.monedas >= apuesta;

  const iniciar = async () => {
    setCargando(true);
    setError(null);
    try {
      await api.iniciarRonda(token, clave, apuesta);
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={comunes.pantalla}>
      <Cabecera alias={estado.yo.alias} monedas={estado.yo.monedas} />
      <ScrollView contentContainerStyle={comunes.contenido}>
        <Text style={comunes.subtitulo}>Comparta esta clave con los demás jugadores</Text>
        <View style={estilos.cajaClave}>
          <Text style={estilos.clave}>{clave}</Text>
        </View>

        <Text style={comunes.titulo}>Jugadores ({estado.jugadores.length})</Text>
        <View style={comunes.tarjeta}>
          {estado.jugadores.map((j) => (
            <View key={j.id} style={estilos.fila}>
              <Text style={estilos.nombre}>
                {j.alias}
                {j.id === estado.sala.anfitrionId ? '  (anfitrión)' : ''}
              </Text>
              <Text style={j.monedas >= apuesta ? estilos.monedas : estilos.sinMonedas}>
                {j.monedas} monedas
              </Text>
            </View>
          ))}
        </View>

        {esAnfitrion ? (
          <>
            <Text style={comunes.etiqueta}>Apuesta por jugador en esta ronda</Text>
            <View style={comunes.grupo}>
              {APUESTAS.map((a) => (
                <Chip
                  key={a}
                  texto={`${a} ${a === 1 ? 'moneda' : 'monedas'}`}
                  activo={a === apuesta}
                  onPress={() => setApuesta(a)}
                />
              ))}
            </View>
            <Text style={comunes.subtitulo}>
              Participan los jugadores con monedas suficientes ({habilitados.length}). El ganador se
              lleva el pozo.
            </Text>
            {error !== null && <Text style={comunes.error}>{error}</Text>}
            <Boton
              titulo={cargando ? 'Iniciando...' : 'Iniciar ronda'}
              onPress={iniciar}
              deshabilitado={!puedeIniciar || cargando}
            />
            {habilitados.length < 2 && (
              <Text style={comunes.subtitulo}>Se necesitan al menos 2 jugadores con monedas.</Text>
            )}
          </>
        ) : (
          <Text style={comunes.subtitulo}>Esperando a que el anfitrión inicie la ronda...</Text>
        )}

        <Boton titulo="Salir de la sala" variante="secundario" onPress={alSalir} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  cajaClave: {
    backgroundColor: colores.blanco,
    borderWidth: 2,
    borderColor: colores.primario,
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
  },
  clave: { fontSize: 40, fontWeight: '700', letterSpacing: 8, color: colores.primario },
  fila: { flexDirection: 'row', justifyContent: 'space-between' },
  nombre: { fontSize: 16, color: colores.texto },
  monedas: { fontSize: 15, color: colores.textoSuave },
  sinMonedas: { fontSize: 15, color: colores.peligro },
});
