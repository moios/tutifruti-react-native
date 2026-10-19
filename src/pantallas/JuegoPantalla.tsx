import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api, ErrorApi, mensajeDe } from '../api';
import Boton from '../componentes/Boton';
import Cabecera from '../componentes/Cabecera';
import { colores, comunes } from '../theme';
import { EstadoSala, Ronda } from '../types';
import { empiezaConLetra, limpiar } from '../utils/texto';

interface Props {
  estado: EstadoSala;
  ronda: Ronda;
  token: string;
  clave: string;
}

export default function JuegoPantalla({ estado, ronda, token, clave }: Props) {
  const categorias = ronda.categorias;
  const total = categorias.length;

  const [respuestas, setRespuestas] = useState<Record<string, string>>(estado.misRespuestas);
  const [indice, setIndice] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [cantado, setCantado] = useState(false);
  const [reintento, setReintento] = useState(0);

  const respuestasRef = useRef(respuestas);
  respuestasRef.current = respuestas;
  const enviadoRef = useRef(false);

  const bloqueada = ronda.estado !== 'jugando' || cantado;
  const enResumen = indice >= total;

  // Botón físico "atrás": vuelve a la vista anterior en lugar de salir de la app.
  useEffect(() => {
    const suscripcion = BackHandler.addEventListener('hardwareBackPress', () => {
      setIndice((actual) => (actual > 0 ? actual - 1 : actual));
      return true;
    });
    return () => suscripcion.remove();
  }, []);

  // Cuando alguien canta tutifruti, se envían las respuestas actuales.
  useEffect(() => {
    if (!bloqueada || enviadoRef.current) {
      return;
    }
    enviadoRef.current = true;
    api.enviar(token, clave, respuestasRef.current).catch(() => {
      enviadoRef.current = false;
      setTimeout(() => setReintento((n) => n + 1), 1500);
    });
  }, [bloqueada, reintento, token, clave]);

  const cambiarTexto = (claveCategoria: string, valor: string) => {
    setRespuestas((previas) => ({ ...previas, [claveCategoria]: valor }));
  };

  const ir = (nuevo: number) => {
    Keyboard.dismiss();
    api.guardar(token, clave, respuestasRef.current).catch(() => undefined);
    setIndice(nuevo);
  };

  const valorDe = (claveCategoria: string): string => limpiar(respuestas[claveCategoria] ?? '');
  const esValida = (claveCategoria: string): boolean =>
    empiezaConLetra(valorDe(claveCategoria), ronda.letra);
  const completa = categorias.every((c) => esValida(c.clave));

  const cantar = async () => {
    setEnviando(true);
    try {
      await api.tutifruti(token, clave, respuestas);
      enviadoRef.current = true;
      setCantado(true);
    } catch (e) {
      if (!(e instanceof ErrorApi && e.codigo === 'ya_cerrada')) {
        Alert.alert('No se pudo cantar tutifruti', mensajeDe(e));
      }
    } finally {
      setEnviando(false);
    }
  };

  if (bloqueada) {
    const quien = cantado ? 'Usted' : ronda.cerroAlias ?? 'Un jugador';
    return (
      <View style={comunes.pantalla}>
        <Cabecera alias={estado.yo.alias} monedas={estado.yo.monedas} clave={clave} />
        <View style={estilos.bloqueo}>
          <Text style={estilos.bloqueoTitulo}>¡TUTIFRUTI!</Text>
          <Text style={estilos.bloqueoTexto}>{quien} completó todas las categorías.</Text>
          <Text style={estilos.bloqueoTexto}>Pantalla bloqueada. Enviando sus respuestas...</Text>
          <ActivityIndicator size="large" color={colores.primario} />
        </View>
      </View>
    );
  }

  const encabezadoLetra = (
    <View style={estilos.letraCaja}>
      <Text style={estilos.letraEtiqueta}>Ronda {ronda.numero} · Letra</Text>
      <Text style={estilos.letra}>{ronda.letra}</Text>
    </View>
  );

  if (enResumen) {
    return (
      <View style={comunes.pantalla}>
        <Cabecera alias={estado.yo.alias} monedas={estado.yo.monedas} clave={clave} />
        <ScrollView contentContainerStyle={comunes.contenido}>
          {encabezadoLetra}
          <Text style={comunes.titulo}>Resumen</Text>
          <Text style={comunes.subtitulo}>Toque una categoría para corregirla.</Text>
          {categorias.map((c, i) => {
            const valor = valorDe(c.clave);
            const valida = esValida(c.clave);
            return (
              <Pressable key={c.clave} style={comunes.tarjeta} onPress={() => ir(i)}>
                <Text style={estilos.resumenCategoria}>{c.etiqueta}</Text>
                <Text style={valida ? estilos.resumenValor : estilos.resumenFalta}>
                  {valor === ''
                    ? 'Sin responder'
                    : valida
                      ? valor
                      : `${valor}  (debe empezar con ${ronda.letra})`}
                </Text>
              </Pressable>
            );
          })}
          <Boton
            titulo={enviando ? 'Enviando...' : '¡TUTIFRUTI!'}
            onPress={cantar}
            deshabilitado={!completa || enviando}
          />
          {!completa && (
            <Text style={comunes.subtitulo}>
              Complete todas las categorías con palabras que empiecen con {ronda.letra} para cantar
              tutifruti.
            </Text>
          )}
          <Boton titulo="Volver" variante="secundario" onPress={() => ir(total - 1)} />
        </ScrollView>
      </View>
    );
  }

  const categoria = categorias[indice];
  const texto = respuestas[categoria.clave] ?? '';
  const hayTexto = limpiar(texto) !== '';
  const invalida = hayTexto && !esValida(categoria.clave);

  return (
    <View style={comunes.pantalla}>
      <Cabecera alias={estado.yo.alias} monedas={estado.yo.monedas} clave={clave} />
      <ScrollView contentContainerStyle={comunes.contenido} keyboardShouldPersistTaps="handled">
        {encabezadoLetra}
        <Text style={comunes.subtitulo}>
          Categoría {indice + 1} de {total}
        </Text>
        <Text style={estilos.categoria}>{categoria.etiqueta}</Text>
        <TextInput
          key={categoria.clave}
          style={comunes.input}
          value={texto}
          onChangeText={(valor) => cambiarTexto(categoria.clave, valor)}
          placeholder={`Empieza con ${ronda.letra}`}
          autoFocus
          autoCorrect={false}
          autoCapitalize="sentences"
          maxLength={60}
          returnKeyType="next"
          onSubmitEditing={() => ir(indice + 1)}
        />
        {invalida && <Text style={comunes.error}>Debe empezar con la letra {ronda.letra}.</Text>}

        <View style={estilos.botones}>
          <View style={estilos.boton}>
            <Boton
              titulo="Volver"
              variante="secundario"
              onPress={() => ir(indice - 1)}
              deshabilitado={indice === 0}
            />
          </View>
          <View style={estilos.boton}>
            <Boton titulo={hayTexto ? 'Siguiente' : 'Saltar'} onPress={() => ir(indice + 1)} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  letraCaja: {
    alignItems: 'center',
    backgroundColor: colores.primarioClaro,
    borderRadius: 8,
    paddingVertical: 12,
  },
  letraEtiqueta: { fontSize: 14, color: colores.textoSuave },
  letra: { fontSize: 64, fontWeight: '700', color: colores.primario, lineHeight: 72 },
  categoria: { fontSize: 28, fontWeight: '700', color: colores.texto },
  botones: { flexDirection: 'row', gap: 12, marginTop: 12 },
  boton: { flex: 1 },
  resumenCategoria: { fontSize: 13, color: colores.textoSuave, textTransform: 'uppercase' },
  resumenValor: { fontSize: 18, color: colores.texto, fontWeight: '600' },
  resumenFalta: { fontSize: 16, color: colores.peligro },
  bloqueo: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 14 },
  bloqueoTitulo: { fontSize: 38, fontWeight: '700', color: colores.primario },
  bloqueoTexto: { fontSize: 16, color: colores.textoSuave, textAlign: 'center' },
});
