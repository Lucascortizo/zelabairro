import { Endereco, StatusOcorrencia } from './types';
import { CORES } from './theme';

// "2026-11-17T14:30:12.123" (formato da API) vira "17/11/2026 14:30"
export const formatarData = (dataIso: string): string => {
  const [data, hora] = dataIso.split('T');
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano} ${hora.slice(0, 5)}`;
};

export const formatarEndereco = (endereco: Endereco): string => {
  const numero: string = endereco.numero !== null && endereco.numero !== '' ? `, ${endereco.numero}` : '';
  return `${endereco.logradouro}${numero}, ${endereco.bairro}, ${endereco.cidade}/${endereco.uf}`;
};

// mesmas faixas dos LEDs do ESP32: verde abaixo de 50, amarelo até 80, vermelho acima
export const corDoNivel = (nivel: number): string => {
  if (nivel > 80) {
    return CORES.vermelho;
  }
  if (nivel >= 50) {
    return CORES.amarelo;
  }
  return CORES.primaria;
};

// cor da etiqueta de status: o texto usa a cor forte e o fundo usa a versão suave
export const corDoStatus = (status: StatusOcorrencia): { cor: string; fundo: string } => {
  if (status === 'ABERTA') {
    return { cor: CORES.vermelho, fundo: CORES.vermelhoSuave };
  }
  if (status === 'EM_ANDAMENTO') {
    return { cor: CORES.amarelo, fundo: CORES.amareloSuave };
  }
  return { cor: CORES.primaria, fundo: CORES.primariaSuave };
};

// o app salva a foto como "data:image/jpeg;base64,...". Se vier só o base64, completa o começo
export const fotoParaUri = (fotoBase64: string): string => {
  if (fotoBase64.startsWith('data:')) {
    return fotoBase64;
  }
  return `data:image/jpeg;base64,${fotoBase64}`;
};
