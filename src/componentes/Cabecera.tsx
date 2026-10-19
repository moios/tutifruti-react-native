import { StyleSheet, Text, View } from 'react-native';
import { colores } from '../theme';

interface Props {
  alias: string;
  monedas: number;
  clave?: string;
}

export default function Cabecera({ alias, monedas, clave }: Props) {
  return (
    <View style={estilos.barra}>
      <View>
        <Text style={estilos.alias}>{alias}</Text>
        {clave !== undefined && <Text style={estilos.clave}>Sala {clave}</Text>}
      </View>
      <Text style={estilos.monedas}>{monedas} monedas</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colores.blanco,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  alias: { fontSize: 17, fontWeight: '700', color: colores.texto },
  clave: { fontSize: 13, color: colores.textoSuave },
  monedas: { fontSize: 16, fontWeight: '700', color: colores.primario },
});
