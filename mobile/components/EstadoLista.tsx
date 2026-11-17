import { type JSX } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '../theme';

// os estados das listas que não são a lista em si: carregando e erro

interface CarregandoProps {
  texto: string;
}

export const Carregando = ({ texto }: CarregandoProps): JSX.Element => {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={CORES.primaria} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
};

interface ErroListaProps {
  mensagem: string;
  onTentarDeNovo: () => void;
}

export const ErroLista = ({ mensagem, onTentarDeNovo }: ErroListaProps): JSX.Element => {
  return (
    <View style={styles.centro}>
      <Ionicons name="cloud-offline-outline" size={48} color={CORES.erro} />
      <Text style={styles.erro}>{mensagem}</Text>
      <TouchableOpacity style={styles.botao} onPress={onTentarDeNovo}>
        <Ionicons name="refresh" size={18} color={CORES.texto} />
        <Text style={styles.botaoTexto}>TENTAR DE NOVO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centro: { flex: 1, backgroundColor: CORES.fundo, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },
  texto: { color: CORES.apagado, fontSize: 14, marginTop: 12 },
  erro: { color: CORES.erro, fontSize: 15, textAlign: 'center', marginTop: 12 },
  botao: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: CORES.borda, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 24, marginTop: 20 },
  botaoTexto: { color: CORES.texto, fontSize: 14, fontWeight: 'bold' },
});
