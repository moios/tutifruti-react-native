import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, mensajeDe } from '../api';
import Boton from '../componentes/Boton';
import { colores, comunes } from '../theme';
import { Sesion } from '../types';
import { limpiar } from '../utils/texto';

interface Props {
  alRegistrar: (sesion: Sesion) => void;
}

export default function RegistroPantalla({ alRegistrar }: Props) {
  const [alias, setAlias] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entrar = async () => {
    const nombre = limpiar(alias);
    if (nombre.length < 2) {
      setError('Escriba un nombre de al menos 2 letras.');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const r = await api.registrar(nombre);
      alRegistrar({ token: r.token, jugador: r.jugador });
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={comunes.pantalla}>
      <KeyboardAvoidingView
        style={estilos.contenedor}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={estilos.marca}>Tutifruti</Text>
        <Text style={estilos.lema}>Con palabra en guaraní</Text>

        <View style={estilos.formulario}>
          <Text style={comunes.etiqueta}>Su nombre de jugador</Text>
          <TextInput
            style={comunes.input}
            value={alias}
            onChangeText={setAlias}
            placeholder="Ejemplo: Moisés"
            maxLength={30}
            autoCapitalize="words"
            autoCorrect={false}
          />
          {error !== null && <Text style={comunes.error}>{error}</Text>}
          <Boton titulo={cargando ? 'Registrando...' : 'Comenzar'} onPress={entrar} deshabilitado={cargando} />
          <Text style={estilos.nota}>Recibirá 10 monedas para sus apuestas.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 24 },
  marca: { fontSize: 40, fontWeight: '700', color: colores.primario, textAlign: 'center' },
  lema: { fontSize: 16, color: colores.textoSuave, textAlign: 'center', marginBottom: 32 },
  formulario: { gap: 10 },
  nota: { fontSize: 14, color: colores.textoSuave, textAlign: 'center' },
});
