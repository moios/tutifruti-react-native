import { Pressable, StyleSheet, Text } from 'react-native';
import { colores } from '../theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'peligro';
  deshabilitado?: boolean;
}

export default function Boton({
  titulo,
  onPress,
  variante = 'primario',
  deshabilitado = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      style={({ pressed }) => [
        estilos.base,
        variante === 'primario' && estilos.primario,
        variante === 'secundario' && estilos.secundario,
        variante === 'peligro' && estilos.peligro,
        deshabilitado && estilos.deshabilitado,
        pressed && estilos.presionado,
      ]}
    >
      <Text style={[estilos.texto, variante === 'secundario' && estilos.textoSecundario]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  primario: { backgroundColor: colores.primario, borderColor: colores.primario },
  secundario: { backgroundColor: colores.blanco, borderColor: colores.primario },
  peligro: { backgroundColor: colores.peligro, borderColor: colores.peligro },
  deshabilitado: { opacity: 0.4 },
  presionado: { opacity: 0.8 },
  texto: { color: colores.blanco, fontSize: 16, fontWeight: '600' },
  textoSecundario: { color: colores.primario },
});
