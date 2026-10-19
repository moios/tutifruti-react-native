import { StyleSheet } from 'react-native';

export const colores = {
  primario: '#1f4e79',
  primarioClaro: '#e6eef6',
  texto: '#1a1a1a',
  textoSuave: '#5c5c5c',
  borde: '#d9d9d9',
  fondo: '#f6f6f4',
  blanco: '#ffffff',
  peligro: '#b3261e',
  exito: '#2e7d32',
};

export const comunes = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 20, gap: 12 },
  titulo: { fontSize: 26, fontWeight: '700', color: colores.texto },
  subtitulo: { fontSize: 15, color: colores.textoSuave },
  tarjeta: {
    backgroundColor: colores.blanco,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    padding: 16,
    gap: 6,
  },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto, marginTop: 8 },
  input: {
    backgroundColor: colores.blanco,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 18,
    color: colores.texto,
  },
  error: { color: colores.peligro, fontSize: 15 },
  grupo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
