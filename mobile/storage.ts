import AsyncStorage from '@react-native-async-storage/async-storage';

// a chave onde o nome do morador fica guardado no celular
const MORADOR_KEY: string = 'morador';

export const salvarMorador = async (nome: string): Promise<void> => {
  await AsyncStorage.setItem(MORADOR_KEY, nome);
};

// devolve null quando ninguém entrou ainda
export const carregarMorador = async (): Promise<string | null> => {
  return AsyncStorage.getItem(MORADOR_KEY);
};

export const apagarMorador = async (): Promise<void> => {
  await AsyncStorage.removeItem(MORADOR_KEY);
};
