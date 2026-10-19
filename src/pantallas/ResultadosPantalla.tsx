import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { api, mensajeDe } from '../api';
import Boton from '../componentes/Boton';
import Cabecera from '../componentes/Cabecera';
import Chip from '../componentes/Chip';
import { APUESTAS } from '../config';
import { colores, comunes } from '../theme';
import { EstadoSala, Resultados, Ronda } from '../types';

interface Props {
  estado: EstadoSala;
  resultados: Resultados;
  ronda: Ronda;
  token: string;
  clave: string;
  alSalir: () => void;
}

export default function ResultadosPantalla({
  estado,
  resultados,
  ronda,
  token,
  clave,
  alSalir,
}: Props) {
  const [apuesta, setApuesta] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esAnfitrion = estado.sala.anfitrionId === estado.yo.id;
  const habilitados = estado.jugadores.filter((j) => j.monedas >= apuesta);
  const puedeIniciar = esAnfitrion && habilitados.length >= 2 && estado.yo.monedas >= apuesta;

  const nuevaRonda = async () => {
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
      <Cabecera alias={estado.yo.alias} monedas={estado.yo.monedas} clave={clave} />
      <ScrollView contentContainerStyle={comunes.contenido}>
        <Text style={comunes.titulo}>Resultados de la ronda {resultados.numero}</Text>
        <Text style={comunes.subtitulo}>
          Letra {resultados.letra} · Pozo: {resultados.pozo} monedas
        </Text>

        {resultados.jugadores.map((j) => (
          <View key={j.id} style={[comunes.tarjeta, j.ganador && estilos.tarjetaGanador]}>
            <View style={estilos.encabezado}>
              <Text style={estilos.alias}>
                {j.alias}
                {j.ganador ? '  (ganador)' : ''}
              </Text>
              <Text style={estilos.puntos}>{j.puntos} pts</Text>
            </View>
            {j.premio > 0 && <Text style={estilos.premio}>Premio: +{j.premio} monedas</Text>}
            {ronda.categorias.map((c) => {
              const r = j.respuestas[c.clave];
              const palabra = r && r.palabra !== '' ? r.palabra : '—';
              const pts = r ? r.puntos : 0;
              return (
                <View key={c.clave} style={estilos.fila}>
                  <Text style={estilos.categoria}>{c.etiqueta}</Text>
                  <Text style={estilos.palabra}>{palabra}</Text>
                  <Text style={pts > 0 ? estilos.ptsOk : estilos.ptsCero}>{pts}</Text>
                </View>
              );
            })}
          </View>
        ))}

        {esAnfitrion ? (
          <>
            <Text style={comunes.etiqueta}>Apuesta para la próxima ronda</Text>
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
            {error !== null && <Text style={comunes.error}>{error}</Text>}
            <Boton
              titulo={cargando ? 'Iniciando...' : 'Nueva ronda'}
              onPress={nuevaRonda}
              deshabilitado={!puedeIniciar || cargando}
            />
            {habilitados.length < 2 && (
              <Text style={comunes.subtitulo}>
                Se necesitan al menos 2 jugadores con monedas suficientes.
              </Text>
            )}
          </>
        ) : (
          <Text style={comunes.subtitulo}>Esperando a que el anfitrión inicie otra ronda...</Text>
        )}

        <Boton titulo="Salir de la sala" variante="secundario" onPress={alSalir} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjetaGanador: { borderColor: colores.exito, borderWidth: 2 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alias: { fontSize: 18, fontWeight: '700', color: colores.texto },
  puntos: { fontSize: 18, fontWeight: '700', color: colores.primario },
  premio: { fontSize: 15, color: colores.exito, fontWeight: '600' },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    paddingVertical: 6,
    gap: 8,
  },
  categoria: { flex: 2, fontSize: 13, color: colores.textoSuave },
  palabra: { flex: 3, fontSize: 15, color: colores.texto },
  ptsOk: { width: 28, textAlign: 'right', fontWeight: '700', color: colores.exito },
  ptsCero: { width: 28, textAlign: 'right', color: colores.peligro },
});
