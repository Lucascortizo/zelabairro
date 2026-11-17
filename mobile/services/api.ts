import { Lixeira, LixeiraComPrevisao, NovaOcorrencia, Ocorrencia, Pagina, Previsao } from '../types';

// IP do PC na rede Wi-Fi. No celular, "localhost" seria o próprio celular, não o computador
export const API_URL: string = 'http://192.168.15.136:8080';

export const listarOcorrencias = async (): Promise<Ocorrencia[]> => {
  const resposta: Response = await fetch(`${API_URL}/ocorrencias?page=0&size=50&sort=dataAbertura,desc`);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status}`);
  }
  const pagina: Pagina<Ocorrencia> = await resposta.json();
  return pagina.content;
};

export const criarOcorrencia = async (nova: NovaOcorrencia): Promise<Ocorrencia> => {
  const resposta: Response = await fetch(`${API_URL}/ocorrencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nova),
  });
  if (resposta.status !== 201) {
    throw new Error(`A API respondeu ${resposta.status}`);
  }
  const criada: Ocorrencia = await resposta.json();
  return criada;
};

export const listarLixeiras = async (): Promise<Lixeira[]> => {
  const resposta: Response = await fetch(`${API_URL}/lixeiras?page=0&size=50&sort=codigo`);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status}`);
  }
  const pagina: Pagina<Lixeira> = await resposta.json();
  return pagina.content;
};

export const buscarPrevisao = async (lixeiraId: number): Promise<Previsao | null> => {
  const resposta: Response = await fetch(`${API_URL}/previsoes?lixeiraId=${lixeiraId}`);
  // 404: a IA ainda não fez previsão para esta lixeira
  if (resposta.status === 404) {
    return null;
  }
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status}`);
  }
  const previsao: Previsao = await resposta.json();
  return previsao;
};

// busca as lixeiras e, para cada uma, a última previsão da IA
export const listarLixeirasComPrevisao = async (): Promise<LixeiraComPrevisao[]> => {
  const lixeiras: Lixeira[] = await listarLixeiras();
  const resultado: LixeiraComPrevisao[] = [];
  for (const lixeira of lixeiras) {
    const previsao: Previsao | null = await buscarPrevisao(lixeira.id);
    resultado.push({ lixeira, previsao });
  }
  return resultado;
};
