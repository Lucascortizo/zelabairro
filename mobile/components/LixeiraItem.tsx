import { type JSX } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LixeiraComPrevisao } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { corDoNivel, formatarEndereco } from '../formatacao';
import { iconeDoNivel } from '../icones';
import { CORES } from '../theme';

interface LixeiraItemProps {
  item: LixeiraComPrevisao;
}

// o cartão de uma lixeira: nível em barra e a previsão da IA
const LixeiraItem = ({ item }: LixeiraItemProps): JSX.Element => {
  const { lixeira, previsao } = item;
  const cor: string = corDoNivel(lixeira.nivelAtual);
  const vaiTransbordar: boolean = previsao !== null && previsao.transbordaEm24h;

  let textoPrevisao: string = 'IA: ainda sem previsão';
  if (previsao !== null) {
    const chance: number = Math.round(previsao.probabilidade * 100);
    textoPrevisao = previsao.transbordaEm24h
      ? `IA: vai transbordar em 24h (${chance}% de chance)`
      : `IA: não deve transbordar em 24h (${chance}% de chance)`;
  }

  return (
    <View style={styles.cartao}>
      <View style={styles.topo}>
        <Text style={styles.codigo}>{lixeira.codigo}</Text>
        <Text style={styles.tipo}>{lixeira.tipo === 'CACAMBA' ? 'Caçamba' : 'Lixeira'}</Text>
      </View>
      <Text style={styles.endereco}>{formatarEndereco(lixeira.endereco)}</Text>

      <View style={styles.barraFundo}>
        <View style={[styles.barra, { width: `${lixeira.nivelAtual}%`, backgroundColor: cor }]} />
      </View>
      <View style={styles.linha}>
        <Ionicons name={iconeDoNivel(lixeira.nivelAtual)} size={18} color={cor} />
        <Text style={[styles.nivel, { color: cor }]}>{lixeira.nivelAtual}% cheia</Text>
      </View>

      <View style={styles.linha}>
        <Ionicons name="analytics-outline" size={18} color={vaiTransbordar ? CORES.vermelho : CORES.apagado} />
        <Text style={[styles.previsao, vaiTransbordar && styles.alerta]}>{textoPrevisao}</Text>
      </View>
    </View>
  );
};

export default LixeiraItem;

const styles = StyleSheet.create({
  cartao: { backgroundColor: CORES.cartao, borderWidth: 1, borderColor: CORES.borda, borderRadius: 10, padding: 14, marginTop: 10 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codigo: { color: CORES.texto, fontSize: 16, fontWeight: 'bold' },
  tipo: { color: CORES.apagado, fontSize: 12 },
  endereco: { color: CORES.apagado, fontSize: 12, marginTop: 4 },
  barraFundo: { height: 10, backgroundColor: CORES.borda, borderRadius: 5, marginTop: 12, overflow: 'hidden' },
  barra: { height: 10, borderRadius: 5 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  nivel: { fontSize: 13, fontWeight: 'bold' },
  previsao: { color: CORES.texto, fontSize: 13, flexShrink: 1 },
  alerta: { color: CORES.vermelho, fontWeight: 'bold' },
});
