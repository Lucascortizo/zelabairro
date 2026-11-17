import { type JSX } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ocorrencia, RootStackParamList, NOME_TIPO } from '../types';
import StatusEtiqueta from '../components/StatusEtiqueta';
import { Ionicons } from '@expo/vector-icons';
import { formatarData, formatarEndereco, fotoParaUri } from '../formatacao';
import { ICONE_TIPO } from '../icones';
import { CORES } from '../theme';

// route chega pronto e tipado para a rota DetalheOcorrencia
type Props = NativeStackScreenProps<RootStackParamList, 'DetalheOcorrencia'>;

interface InformacaoProps {
  rotulo: string;
  valor: string;
}

// um par rótulo e valor do detalhe
const Informacao = ({ rotulo, valor }: InformacaoProps): JSX.Element => {
  return (
    <View style={styles.informacao}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
};

const DetalheOcorrenciaScreen = ({ route }: Props): JSX.Element => {
  // a ocorrência que a lista mandou junto
  const ocorrencia: Ocorrencia = route.params.ocorrencia;
  const temFoto: boolean = ocorrencia.fotoBase64 !== null && ocorrencia.fotoBase64 !== '';

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      {temFoto && ocorrencia.fotoBase64 !== null && (
        <Image source={{ uri: fotoParaUri(ocorrencia.fotoBase64) }} style={styles.foto} />
      )}
      {!temFoto && <Text style={styles.semFoto}>Ocorrência sem foto</Text>}

      <View style={styles.tipoLinha}>
        <Ionicons name={ICONE_TIPO[ocorrencia.tipo]} size={28} color={CORES.primaria} />
        <Text style={styles.tipo}>{NOME_TIPO[ocorrencia.tipo]}</Text>
      </View>
      <View style={styles.status}>
        <StatusEtiqueta status={ocorrencia.status} />
      </View>

      <Informacao rotulo="Descrição" valor={ocorrencia.descricao} />
      <Informacao rotulo="Endereço" valor={`${formatarEndereco(ocorrencia.endereco)}, CEP ${ocorrencia.endereco.cep}`} />
      <Informacao rotulo="Avisado por" valor={ocorrencia.autorNome} />
      <Informacao rotulo="Aberta em" valor={formatarData(ocorrencia.dataAbertura)} />
      {ocorrencia.dataResolucao !== null && (
        <Informacao rotulo="Resolvida em" valor={formatarData(ocorrencia.dataResolucao)} />
      )}
    </ScrollView>
  );
};

export default DetalheOcorrenciaScreen;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  conteudo: { padding: 24 },
  foto: { width: '100%', height: 240, borderRadius: 10, marginBottom: 20 },
  semFoto: { color: CORES.apagado, fontSize: 13, marginBottom: 16 },
  tipoLinha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tipo: { color: CORES.primaria, fontSize: 26, fontWeight: 'bold' },
  status: { marginTop: 8 },
  informacao: { marginTop: 18 },
  rotulo: { color: CORES.apagado, fontSize: 12 },
  valor: { color: CORES.texto, fontSize: 16, marginTop: 4 },
});
