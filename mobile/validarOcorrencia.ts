import { FormularioOcorrencia, ErrosFormulario, ResultadoValidacao, SEM_ERROS } from './types';

// mesmo limite do fotoBase64 na API (@Size no OcorrenciaDto)
export const TAMANHO_MAXIMO_FOTO: number = 1500000;

// função pura: recebe o formulário e devolve os erros, sem mexer em tela nem em estado
export const validarOcorrencia = (formulario: FormularioOcorrencia): ResultadoValidacao => {
  const erros: ErrosFormulario = { ...SEM_ERROS };
  const descricao: string = formulario.descricao.trim();

  if (formulario.tipo === null) {
    erros.tipo = 'Escolha o tipo do problema';
  }
  if (descricao.length < 10) {
    erros.descricao = 'Descreva com pelo menos 10 letras';
  } else if (descricao.length > 500) {
    erros.descricao = 'Máximo de 500 letras';
  }
  if (formulario.logradouro.trim() === '') {
    erros.logradouro = 'Informe a rua';
  }
  if (formulario.bairro.trim() === '') {
    erros.bairro = 'Informe o bairro';
  }
  if (formulario.cidade.trim() === '') {
    erros.cidade = 'Informe a cidade';
  }
  if (!/^[A-Za-z]{2}$/.test(formulario.uf.trim())) {
    erros.uf = 'UF com 2 letras';
  }
  // mesmo padrão da API: 5 números, hífen opcional, 3 números
  if (!/^\d{5}-?\d{3}$/.test(formulario.cep.trim())) {
    erros.cep = 'CEP no formato 00000-000';
  }
  if (formulario.fotoBase64 !== null && formulario.fotoBase64.length > TAMANHO_MAXIMO_FOTO) {
    erros.fotoBase64 = 'Foto muito grande, escolha outra';
  }

  const valido: boolean = Object.values(erros).every((erro: string) => erro === '');
  return { valido, erros };
};
