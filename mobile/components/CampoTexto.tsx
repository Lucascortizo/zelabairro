import { type JSX } from 'react';
import { Text, TextInput, KeyboardTypeOptions, StyleSheet } from 'react-native';
import { CORES } from '../theme';

interface CampoTextoProps {
  rotulo: string;
  valor: string;
  erro: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  maxLength?: number;
}

// rótulo, caixa de texto e mensagem de erro: o trio que se repete em todo campo do formulário
const CampoTexto = ({
  rotulo, valor, erro, onChangeText, placeholder, keyboardType, multiline, maxLength,
}: CampoTextoProps): JSX.Element => {
  return (
    <>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, multiline === true && styles.multilinha]}
        placeholder={placeholder}
        placeholderTextColor={CORES.apagado}
        value={valor}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        maxLength={maxLength}
      />
      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
    </>
  );
};

export default CampoTexto;

const styles = StyleSheet.create({
  rotulo: { color: CORES.apagado, fontSize: 12, marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: CORES.cartao, borderWidth: 1, borderColor: CORES.borda, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: CORES.texto, fontSize: 16 },
  multilinha: { minHeight: 90, textAlignVertical: 'top' },
  erro: { color: CORES.erro, fontSize: 12, marginTop: 6 },
});
