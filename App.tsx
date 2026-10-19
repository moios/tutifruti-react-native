import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { guardarSala, guardarSesion, leerSala, leerSesion } from './src/almacen';
import MenuPantalla from './src/pantallas/MenuPantalla';
import RegistroPantalla from './src/pantallas/RegistroPantalla';
import SalaPantalla from './src/pantallas/SalaPantalla';
import { colores } from './src/theme';
import { Jugador, Sesion } from './src/types';

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [clave, setClave] = useState<string | null>(null);

  useEffect(() => {
    const iniciar = async () => {
      try {
        const guardada = await leerSesion();
        const sala = await leerSala();
        setSesion(guardada);
        setClave(guardada !== null ? sala : null);
      } finally {
        setCargando(false);
      }
    };
    iniciar();
  }, []);

  const alRegistrar = useCallback(async (nueva: Sesion) => {
    await guardarSesion(nueva);
    setSesion(nueva);
  }, []);

  const alActualizarJugador = useCallback((jugador: Jugador) => {
    setSesion((actual) => {
      if (actual === null) {
        return actual;
      }
      if (actual.jugador.monedas === jugador.monedas && actual.jugador.alias === jugador.alias) {
        return actual;
      }
      const nueva = { ...actual, jugador };
      guardarSesion(nueva);
      return nueva;
    });
  }, []);

  const alEntrar = useCallback(async (nuevaClave: string) => {
    await guardarSala(nuevaClave);
    setClave(nuevaClave);
  }, []);

  const alSalir = useCallback(async () => {
    await guardarSala(null);
    setClave(null);
  }, []);

  let contenido;
  if (cargando) {
    contenido = (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  } else if (sesion === null) {
    contenido = <RegistroPantalla alRegistrar={alRegistrar} />;
  } else if (clave === null) {
    contenido = (
      <MenuPantalla
        sesion={sesion}
        alEntrar={alEntrar}
        alActualizarJugador={alActualizarJugador}
      />
    );
  } else {
    contenido = (
      <SalaPantalla
        sesion={sesion}
        clave={clave}
        alSalir={alSalir}
        alActualizarJugador={alActualizarJugador}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {contenido}
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colores.fondo },
});
