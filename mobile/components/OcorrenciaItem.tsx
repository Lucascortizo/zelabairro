import { type JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ocorrencia, NOME_TIPO } from '../types';
import StatusEtiqueta from './StatusEtiqueta';
import { Ionicons } from '@expo/vector-icons';
import { formatarData } from '../formatacao';
import { ICONE_TIPO } from '../icones';
import { CORES } from '../theme';

interface OcorrenciaItemProps {
  ocorrencia: Ocorrencia;
  onPress: (ocorrencia: Ocorrencia) => void;
}

// o cartão de uma ocorrência na lista
const OcorrenciaItem = ({ ocorrencia, onPress }: OcorrenciaItemProps): JSX.Element => {
  return (
    <TouchableOpacity style={styles.cartao} onPress={() => onPress(ocorrencia)}>
      <View style={styles.topo}>
        <View style={styles.tipoLinha}>
          <Ionicons name={ICONE_TIPO[ocorrencia.tipo]} size={20} color={CORES.primaria} />
          <Text style={styles.tipo}>{NOME_TIPO[ocorrencia.tipo]}</Text>
        </View>
        <StatusEtiqueta status={ocorrencia.status} />
      </View>
      <Text style={styles.descricao} numberOfLines={2}>{ocorrencia.descricao}</Text>
      <Text style={styles.data}>{formatarData(ocorrencia.dataAbertura)} · {ocorrencia.endereco.bairro}</Text>
    </TouchableOpacity>
  );
};

export default OcorrenciaItem;

const styles = StyleSheet.create({
  cartao: { backgroundColor: CORES.cartao, borderWidth: 1, borderColor: CORES.borda, borderRadius: 10, padding: 14, marginTop: 10 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipoLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipo: { color: CORES.texto, fontSize: 16, fontWeight: 'bold' },
  descricao: { color: CORES.texto, fontSize: 14, marginTop: 6 },
  data: { color: CORES.apagado, fontSize: 12, marginTop: 6 },
});
