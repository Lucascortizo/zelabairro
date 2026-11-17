import { useState, useEffect, type JSX } from 'react';
import { View, Text, FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LixeiraComPrevisao } from '../types';
import { listarLixeirasComPrevisao } from '../services/api';
import LixeiraItem from '../components/LixeiraItem';
import { Carregando, ErroLista } from '../components/EstadoLista';
import { CORES } from '../theme';

const LixeirasScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [itens, setItens] = useState<LixeiraComPrevisao[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>('');

  const carregar = async (): Promise<void> => {
    setCarregando(true);
    setErro('');
    try {
      const lista: LixeiraComPrevisao[] = await listarLixeirasComPrevisao();
      setItens(lista);
    } catch {
      setErro('Não consegui buscar as lixeiras. Confira se a API está rodando e se o IP em services/api.ts está certo.');
    } finally {
      setCarregando(false);
    }
  };

  // recarrega toda vez que a tab aparece, para mostrar o nível mais novo do sensor
  useEffect(() => {
    const cancelar = navigation.addListener('focus', carregar);
    return cancelar;
  }, [navigation]);

  const renderLixeira = ({ item }: ListRenderItemInfo<LixeiraComPrevisao>): JSX.Element => {
    return <LixeiraItem item={item} />;
  };

  if (carregando) {
    return <Carregando texto="Carregando lixeiras..." />;
  }
  if (erro !== '') {
    return <ErroLista mensagem={erro} onTentarDeNovo={carregar} />;
  }

  return (
    <View style={styles.tela}>
      <FlatList
        data={itens}
        keyExtractor={(item: LixeiraComPrevisao) => String(item.lixeira.id)}
        renderItem={renderLixeira}
        ListHeaderComponent={<Text style={styles.ajuda}>Nível medido pelo sensor e previsão da IA. Puxe a lista para atualizar.</Text>}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma lixeira cadastrada.</Text>}
        contentContainerStyle={styles.lista}
        onRefresh={carregar}
        refreshing={false}
      />
    </View>
  );
};

export default LixeirasScreen;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  lista: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  ajuda: { color: CORES.apagado, fontSize: 14 },
  vazio: { color: CORES.apagado, fontSize: 15, textAlign: 'center', marginTop: 40 },
});
