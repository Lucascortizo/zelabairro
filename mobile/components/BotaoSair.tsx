import { type JSX } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { apagarMorador } from '../storage';
import { CORES } from '../theme';

// o botão SAIR do header. Ele não mora em tela nenhuma, por isso pega a navegação pelo hook
const BotaoSair = (): JSX.Element => {
  const navigation = useNavigation();

  const sair = async (): Promise<void> => {
    await apagarMorador();
    // as tabs não têm replace: a ação sobe até o stack da raiz
    navigation.dispatch(StackActions.replace('Login'));
  };

  return (
    <TouchableOpacity style={styles.botao} onPress={sair}>
      <Ionicons name="log-out-outline" size={16} color={CORES.texto} />
      <Text style={styles.texto}>SAIR</Text>
    </TouchableOpacity>
  );
};

export default BotaoSair;

const styles = StyleSheet.create({
  botao: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: CORES.borda, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12, marginRight: 12 },
  texto: { color: CORES.texto, fontSize: 12, fontWeight: 'bold' },
});
