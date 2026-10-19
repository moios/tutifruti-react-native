import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, mensajeDe } from '../api';
import Boton from '../componentes/Boton';
import Cabecera from '../componentes/Cabecera';
import { colores, comunes } from '../theme';
import { Jugador, Sesion } from '../types';

interface Props {
  sesion: Sesion;
  alEntrar: (clave: string) => void;
  alActualizarJugador: (jugador: Jugador) => void;
}

export default function MenuPantalla({ sesion, alEntrar, alActualizarJugador }: Props) {
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .perfil(sesion.token)
      .then((r) => alActualizarJugador(r.jugador))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion.token]);

  const crear = async () => {
    setCargando(true);
    setError(null);
    try {
      const r = await api.crearSala(sesion.token);
      alEntrar(r.clave);
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setCargando(false);
    }
  };

  const unirse = async () => {
    const limpia = clave.trim().toUpperCase();
    if (limpia.length < 4) {
      setError('Escriba la clave de la sala.');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const r = await api.unirse(sesion.token, limpia);
      alEntrar(r.clave);
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={comunes.pantalla}>
      <Cabecera alias={sesion.jugador.alias} monedas={sesion.jugador.monedas} />
      <ScrollView contentContainerStyle={comunes.contenido} keyboardShouldPersistTaps="handled">
        <Text style={comunes.titulo}>Jugar</Text>
        <Text style={comunes.subtitulo}>
          Cree una sala y comparta la clave, o ingrese la clave que le compartieron.
        </Text>

        <View style={comunes.tarjeta}>
          <Text style={estilos.seccion}>Crear una sala nueva</Text>
          <Boton titulo="Crear sala" onPress={crear} deshabilitado={cargando} />
        </View>

        <View style={comunes.tarjeta}>
          <Text style={estilos.seccion}>Unirme con una clave</Text>
          <TextInput
            style={[comunes.input, estilos.clave]}
            value={clave}
            onChangeText={setClave}
            placeholder="CLAVE"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
          />
          <Boton titulo="Unirme" variante="secundario" onPress={unirse} deshabilitado={cargando} />
        </View>

        {error !== null && <Text style={comunes.error}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  seccion: { fontSize: 17, fontWeight: '700', color: colores.texto },
  clave: { textAlign: 'center', letterSpacing: 4, fontWeight: '700' },
});
