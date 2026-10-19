import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sesion } from './types';

const CLAVE_SESION = 'tutifruti:sesion';
const CLAVE_SALA = 'tutifruti:sala';

export async function leerSesion(): Promise<Sesion | null> {
  const texto = await AsyncStorage.getItem(CLAVE_SESION);
  return texto === null ? null : (JSON.parse(texto) as Sesion);
}

export async function guardarSesion(sesion: Sesion): Promise<void> {
  await AsyncStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export async function leerSala(): Promise<string | null> {
  return AsyncStorage.getItem(CLAVE_SALA);
}

export async function guardarSala(clave: string | null): Promise<void> {
  if (clave === null) {
    await AsyncStorage.removeItem(CLAVE_SALA);
  } else {
    await AsyncStorage.setItem(CLAVE_SALA, clave);
  }
}
