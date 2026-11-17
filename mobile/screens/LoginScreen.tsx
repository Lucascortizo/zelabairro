import { useState, useEffect, type JSX } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform, StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { validarNome } from '../validarNome';
import { salvarMorador, carregarMorador } from '../storage';
import { CORES } from '../theme';

// navigation chega pronto e tipado para a rota Login
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props): JSX.Element => {
  const [nome, setNome] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  // true enquanto o app confere se já existe um nome salvo
  const [verificando, setVerificando] = useState<boolean>(true);

  // quando a tela abre: se o morador já entrou antes, vai direto para o app
  useEffect(() => {
    const verificar = async (): Promise<void> => {
      const salvo: string | null = await carregarMorador();
      if (salvo !== null) {
        navigation.replace('Home');
        return;
      }
      setVerificando(false);
    };
    verificar();
  }, [navigation]);

  const alterarNome = (texto: string): void => {
    setNome(texto);
    setErro('');
  };

  const entrar = async (): Promise<void> => {
    const mensagem: string = validarNome(nome);
    setErro(mensagem);
    if (mensagem !== '') {
      return;
    }
    await salvarMorador(nome.trim());
    navigation.replace('Home');
  };

  if (verificando) {
    return (
      <View style={[styles.tela, styles.centro]}>
        <ActivityIndicator size="large" color={CORES.primaria} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.conteudo}>
        <Ionicons name="leaf" size={48} color={CORES.primaria} />
        <Text style={styles.titulo}>ZELABAIRRO</Text>
        <Text style={styles.subtitulo}>avise os problemas do seu bairro. Qual é o seu nome?</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor={CORES.apagado}
          value={nome}
          onChangeText={alterarNome}
          maxLength={100}
        />
        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        <TouchableOpacity style={styles.botao} onPress={entrar}>
          <Ionicons name="log-in-outline" size={20} color={CORES.textoBotao} />
          <Text style={styles.botaoTexto}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  centro: { justifyContent: 'center', alignItems: 'center' },
  conteudo: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  titulo: { color: CORES.primaria, fontSize: 28, fontWeight: 'bold', marginTop: 8 },
  subtitulo: { color: CORES.apagado, fontSize: 14, marginTop: 8, marginBottom: 24 },
  input: { backgroundColor: CORES.cartao, borderWidth: 1, borderColor: CORES.borda, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: CORES.texto, fontSize: 16 },
  erro: { color: CORES.erro, fontSize: 12, marginTop: 6 },
  botao: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: CORES.primaria, borderRadius: 999, paddingVertical: 14, marginTop: 24 },
  botaoTexto: { color: CORES.textoBotao, fontSize: 16, fontWeight: 'bold' },
});
