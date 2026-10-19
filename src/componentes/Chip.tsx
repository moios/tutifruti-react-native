import { Pressable, StyleSheet, Text } from 'react-native';
import { colores } from '../theme';

interface Props {
  texto: string;
  activo: boolean;
  onPress: () => void;
  deshabilitado?: boolean;
}

export default function Chip({ texto, activo, onPress, deshabilitado = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      style={[estilos.base, activo && estilos.activo, deshabilitado && estilos.deshabilitado]}
    >
      <Text style={[estilos.texto, activo && estilos.textoActivo]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  activo: { backgroundColor: colores.primario, borderColor: colores.primario },
  deshabilitado: { opacity: 0.35 },
  texto: { fontSize: 16, color: colores.texto },
  textoActivo: { color: colores.blanco, fontWeight: '600' },
});
