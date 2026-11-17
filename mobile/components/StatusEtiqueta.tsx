import { type JSX } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusOcorrencia, NOME_STATUS } from '../types';
import { corDoStatus } from '../formatacao';
import { ICONE_STATUS } from '../icones';

interface StatusEtiquetaProps {
  status: StatusOcorrencia;
}

// a etiqueta colorida do status: vermelha aberta, amarela em andamento, verde resolvida
const StatusEtiqueta = ({ status }: StatusEtiquetaProps): JSX.Element => {
  const { cor, fundo } = corDoStatus(status);

  return (
    <View style={[styles.etiqueta, { borderColor: cor, backgroundColor: fundo }]}>
      <Ionicons name={ICONE_STATUS[status]} size={14} color={cor} />
      <Text style={[styles.texto, { color: cor }]}>{NOME_STATUS[status]}</Text>
    </View>
  );
};

export default StatusEtiqueta;

const styles = StyleSheet.create({
  etiqueta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, borderWidth: 1, borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
  texto: { fontSize: 12, fontWeight: 'bold' },
});
