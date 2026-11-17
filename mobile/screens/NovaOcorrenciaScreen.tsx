import { useState, useEffect, type JSX } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import {
  CampoTexto as Campo, ErrosFormulario, FormularioOcorrencia, NovaOcorrencia, ResultadoValidacao,
  TabParamList, TipoOcorrencia, FORMULARIO_VAZIO, NOME_TIPO, SEM_ERROS, TIPOS_OCORRENCIA,
} from '../types';
import { validarOcorrencia } from '../validarOcorrencia';
import { ICONE_TIPO } from '../icones';
import { criarOcorrencia } from '../services/api';
import { carregarMorador } from '../storage';
import CampoTexto from '../components/CampoTexto';
import { CORES } from '../theme';

// navigation chega pronto e tipado para a tab NovaOcorrencia
type Props = BottomTabScreenProps<TabParamList, 'NovaOcorrencia'>;

const NovaOcorrenciaScreen = ({ navigation }: Props): JSX.Element => {
  const [formulario, setFormulario] = useState<FormularioOcorrencia>(FORMULARIO_VAZIO);
  const [erros, setErros] = useState<ErrosFormulario>(SEM_ERROS);
  const [morador, setMorador] = useState<string>('');
  const [enviando, setEnviando] = useState<boolean>(false);

  // o autor da ocorrência é o nome que o morador digitou no login
  useEffect(() => {
    const lerNome = async (): Promise<void> => {
      const salvo: string | null = await carregarMorador();
      setMorador(salvo ?? '');
    };
    lerNome();
  }, []);

  // uma função só para todos os campos de texto: o nome do campo diz qual pedaço mudar
  const alterarCampo = (campo: Campo, texto: string): void => {
    setFormulario((atual) => ({ ...atual, [campo]: texto }));
    setErros((atual) => ({ ...atual, [campo]: '' }));
  };

  const escolherTipo = (tipo: TipoOcorrencia): void => {
    setFormulario((atual) => ({ ...atual, tipo }));
    setErros((atual) => ({ ...atual, tipo: '' }));
  };

  const escolherFoto = async (): Promise<void> => {
    // primeiro pede a permissão; sem ela a galeria não abre
    const permissao: ImagePicker.MediaLibraryPermissionResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        'Sem acesso à galeria',
        'A foto é opcional. Para anexar uma, permita o acesso às fotos nas configurações do celular.',
      );
      return;
    }

    // quality baixa e base64: a foto vai como texto dentro do JSON, então precisa ser leve
    const resultado: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.3,
      base64: true,
    });
    if (resultado.canceled) {
      return;
    }
    const imagem: ImagePicker.ImagePickerAsset = resultado.assets[0];
    if (imagem.base64 === null || imagem.base64 === undefined) {
      return;
    }
    const tipoImagem: string = imagem.mimeType ?? 'image/jpeg';
    setFormulario((atual) => ({ ...atual, fotoBase64: `data:${tipoImagem};base64,${imagem.base64}` }));
    setErros((atual) => ({ ...atual, fotoBase64: '' }));
  };

  const removerFoto = (): void => {
    setFormulario((atual) => ({ ...atual, fotoBase64: null }));
    setErros((atual) => ({ ...atual, fotoBase64: '' }));
  };

  const enviar = async (): Promise<void> => {
    const resultado: ResultadoValidacao = validarOcorrencia(formulario);
    setErros(resultado.erros);
    // a segunda condição é só para o TypeScript saber que o tipo não é null daqui para baixo
    if (!resultado.valido || formulario.tipo === null) {
      return;
    }

    const numero: string = formulario.numero.trim();
    const nova: NovaOcorrencia = {
      tipo: formulario.tipo,
      descricao: formulario.descricao.trim(),
      fotoBase64: formulario.fotoBase64,
      autorNome: morador,
      endereco: {
        logradouro: formulario.logradouro.trim(),
        numero: numero === '' ? null : numero,
        bairro: formulario.bairro.trim(),
        cidade: formulario.cidade.trim(),
        uf: formulario.uf.trim().toUpperCase(),
        cep: formulario.cep.trim(),
      },
    };

    setEnviando(true);
    try {
      await criarOcorrencia(nova);
      setFormulario(FORMULARIO_VAZIO);
      Alert.alert('Ocorrência enviada', 'A subprefeitura já pode ver o seu aviso.', [
        { text: 'Ver lista', onPress: () => navigation.navigate('Ocorrencias') },
      ]);
    } catch {
      Alert.alert('Não foi possível enviar', 'Confira se a API está rodando e tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.autor}>Avisando como {morador}</Text>

        <Text style={styles.rotulo}>Tipo do problema</Text>
        <View style={styles.opcoes}>
          {TIPOS_OCORRENCIA.map((tipo: TipoOcorrencia) => (
            <TouchableOpacity
              key={tipo}
              style={[styles.opcao, formulario.tipo === tipo && styles.opcaoAtiva]}
              onPress={() => escolherTipo(tipo)}>
              <Ionicons
                name={ICONE_TIPO[tipo]}
                size={16}
                color={formulario.tipo === tipo ? CORES.primaria : CORES.apagado}
              />
              <Text style={styles.opcaoTexto}>{NOME_TIPO[tipo]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {erros.tipo !== '' && <Text style={styles.erro}>{erros.tipo}</Text>}

        <CampoTexto
          rotulo="Descrição"
          placeholder="O que está acontecendo?"
          valor={formulario.descricao}
          erro={erros.descricao}
          onChangeText={(texto: string) => alterarCampo('descricao', texto)}
          multiline
          maxLength={500}
        />
        <CampoTexto
          rotulo="Rua"
          placeholder="Ex.: Rua Oscar Freire"
          valor={formulario.logradouro}
          erro={erros.logradouro}
          onChangeText={(texto: string) => alterarCampo('logradouro', texto)}
        />
        <CampoTexto
          rotulo="Número (opcional)"
          valor={formulario.numero}
          erro={erros.numero}
          onChangeText={(texto: string) => alterarCampo('numero', texto)}
          keyboardType="numeric"
        />
        <CampoTexto
          rotulo="Bairro"
          valor={formulario.bairro}
          erro={erros.bairro}
          onChangeText={(texto: string) => alterarCampo('bairro', texto)}
        />
        <CampoTexto
          rotulo="Cidade"
          valor={formulario.cidade}
          erro={erros.cidade}
          onChangeText={(texto: string) => alterarCampo('cidade', texto)}
        />
        <CampoTexto
          rotulo="UF"
          valor={formulario.uf}
          erro={erros.uf}
          onChangeText={(texto: string) => alterarCampo('uf', texto)}
          maxLength={2}
        />
        <CampoTexto
          rotulo="CEP"
          placeholder="00000-000"
          valor={formulario.cep}
          erro={erros.cep}
          onChangeText={(texto: string) => alterarCampo('cep', texto)}
          keyboardType="numeric"
          maxLength={9}
        />

        <Text style={styles.rotulo}>Foto (opcional)</Text>
        {formulario.fotoBase64 !== null && (
          <Image source={{ uri: formulario.fotoBase64 }} style={styles.foto} />
        )}
        <TouchableOpacity style={styles.secundario} onPress={formulario.fotoBase64 === null ? escolherFoto : removerFoto}>
          <Ionicons
            name={formulario.fotoBase64 === null ? 'image-outline' : 'close-circle-outline'}
            size={20}
            color={CORES.texto}
          />
          <Text style={styles.secundarioTexto}>
            {formulario.fotoBase64 === null ? 'ESCOLHER FOTO DA GALERIA' : 'REMOVER FOTO'}
          </Text>
        </TouchableOpacity>
        {erros.fotoBase64 !== '' && <Text style={styles.erro}>{erros.fotoBase64}</Text>}

        <TouchableOpacity style={[styles.botao, enviando && styles.botaoDesligado]} onPress={enviar} disabled={enviando}>
          <Ionicons name="send" size={18} color={CORES.textoBotao} />
          <Text style={styles.botaoTexto}>{enviando ? 'ENVIANDO...' : 'ENVIAR OCORRÊNCIA'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NovaOcorrenciaScreen;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  conteudo: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  autor: { color: CORES.apagado, fontSize: 13 },
  rotulo: { color: CORES.apagado, fontSize: 12, marginTop: 16, marginBottom: 6 },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: CORES.borda, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  opcaoAtiva: { borderColor: CORES.primaria, backgroundColor: CORES.primariaSuave },
  opcaoTexto: { color: CORES.texto, fontSize: 13 },
  erro: { color: CORES.erro, fontSize: 12, marginTop: 6 },
  foto: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  secundario: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: CORES.borda, borderRadius: 999, paddingVertical: 12 },
  secundarioTexto: { color: CORES.texto, fontSize: 14, fontWeight: 'bold' },
  botao: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: CORES.primaria, borderRadius: 999, paddingVertical: 14, marginTop: 32 },
  botaoDesligado: { opacity: 0.5 },
  botaoTexto: { color: CORES.textoBotao, fontSize: 16, fontWeight: 'bold' },
});
