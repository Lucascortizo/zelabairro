import { useState, useEffect, type JSX } from 'react';
import { View, Text, FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ocorrencia, RootStackParamList } from '../types';
import { listarOcorrencias } from '../services/api';
import { carregarMorador } from '../storage';
import OcorrenciaItem from '../components/OcorrenciaItem';
import { Carregando, ErroLista } from '../components/EstadoLista';
import { CORES } from '../theme';

const OcorrenciasScreen = (): JSX.Element => {
  // o hook entrega a navegação tipada com as rotas do stack da raiz, esteja esta tela onde estiver
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>('');
  const [morador, setMorador] = useState<string>('');

  const carregar = async (): Promise<void> => {
    setCarregando(true);
    setErro('');
    try {
      const lista: Ocorrencia[] = await listarOcorrencias();
      setOcorrencias(lista);
    } catch {
      setErro('Não consegui buscar as ocorrências. Confira se a API está rodando e se o IP em services/api.ts está certo.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const lerNome = async (): Promise<void> => {
      const salvo: string | null = await carregarMorador();
      setMorador(salvo ?? '');
    };
    lerNome();
  }, []);

  // 'focus' dispara toda vez que a tab aparece, inclusive na primeira.
  // Assim a lista volta atualizada depois de criar uma ocorrência
  useEffect(() => {
    const cancelar = navigation.addListener('focus', carregar);
    return cancelar;
  }, [navigation]);

  const abrir = (ocorrencia: Ocorrencia): void => {
    navigation.navigate('DetalheOcorrencia', { ocorrencia });
  };

  const renderOcorrencia = ({ item }: ListRenderItemInfo<Ocorrencia>): JSX.Element => {
    return <OcorrenciaItem ocorrencia={item} onPress={abrir} />;
  };

  if (carregando) {
    return <Carregando texto="Carregando ocorrências..." />;
  }
  if (erro !== '') {
    return <ErroLista mensagem={erro} onTentarDeNovo={carregar} />;
  }

  return (
    <View style={styles.tela}>
      <FlatList
        data={ocorrencias}
        keyExtractor={(ocorrencia: Ocorrencia) => String(ocorrencia.id)}
        renderItem={renderOcorrencia}
        ListHeaderComponent={<Text style={styles.ola}>Olá, {morador}. Estes são os problemas avisados no bairro.</Text>}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma ocorrência ainda. Use a tab Nova para avisar um problema.</Text>}
        contentContainerStyle={styles.lista}
        onRefresh={carregar}
        refreshing={false}
      />
    </View>
  );
};

export default OcorrenciasScreen;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  lista: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  ola: { color: CORES.apagado, fontSize: 14 },
  vazio: { color: CORES.apagado, fontSize: 15, textAlign: 'center', marginTop: 40 },
});
