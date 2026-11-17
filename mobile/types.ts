// TIPOS DA API: os mesmos nomes do contrato de integração (CLAUDE.md)

export type TipoOcorrencia = 'LIXO_IRREGULAR' | 'LIXEIRA_CHEIA' | 'BURACO' | 'POSTE_APAGADO' | 'OUTRO';
export type StatusOcorrencia = 'ABERTA' | 'EM_ANDAMENTO' | 'RESOLVIDA';
export type TipoLixeira = 'LIXEIRA' | 'CACAMBA';

export interface Endereco {
  logradouro: string;
  numero: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Ocorrencia {
  id: number;
  tipo: TipoOcorrencia;
  descricao: string;
  fotoBase64: string | null;
  autorNome: string;
  endereco: Endereco;
  status: StatusOcorrencia;
  dataAbertura: string;
  dataResolucao: string | null;
  ativo: boolean;
}

// o que o app manda no POST /ocorrencias; id, status e datas a API preenche
export interface NovaOcorrencia {
  tipo: TipoOcorrencia;
  descricao: string;
  fotoBase64: string | null;
  autorNome: string;
  endereco: Endereco;
}

export interface Lixeira {
  id: number;
  codigo: string;
  tipo: TipoLixeira;
  endereco: Endereco;
  nivelAtual: number;
  ativo: boolean;
}

export interface Previsao {
  id: number;
  lixeiraId: number;
  transbordaEm24h: boolean;
  probabilidade: number;
  dataHora: string;
}

// a lixeira junto com a última previsão da IA; null quando ainda não há previsão
export interface LixeiraComPrevisao {
  lixeira: Lixeira;
  previsao: Previsao | null;
}

// formato das listas paginadas da API
export interface Pagina<T> {
  content: T[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
}

export const TIPOS_OCORRENCIA: TipoOcorrencia[] = ['LIXO_IRREGULAR', 'LIXEIRA_CHEIA', 'BURACO', 'POSTE_APAGADO', 'OUTRO'];

export const NOME_TIPO: Record<TipoOcorrencia, string> = {
  LIXO_IRREGULAR: 'Lixo irregular',
  LIXEIRA_CHEIA: 'Lixeira cheia',
  BURACO: 'Buraco',
  POSTE_APAGADO: 'Poste apagado',
  OUTRO: 'Outro',
};

export const NOME_STATUS: Record<StatusOcorrencia, string> = {
  ABERTA: 'Aberta',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDA: 'Resolvida',
};

// FORMULÁRIO: tudo texto enquanto a pessoa digita; vira NovaOcorrencia só no envio

export interface FormularioOcorrencia {
  tipo: TipoOcorrencia | null;
  descricao: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  fotoBase64: string | null;
}

// os campos que são digitados num TextInput
export type CampoTexto = 'descricao' | 'logradouro' | 'numero' | 'bairro' | 'cidade' | 'uf' | 'cep';

// um texto de erro para cada campo; vazio quer dizer sem erro
export type ErrosFormulario = Record<keyof FormularioOcorrencia, string>;

export interface ResultadoValidacao {
  valido: boolean;
  erros: ErrosFormulario;
}

export const FORMULARIO_VAZIO: FormularioOcorrencia = {
  tipo: null,
  descricao: '',
  logradouro: '',
  numero: '',
  bairro: 'Jardim Paulista',
  cidade: 'São Paulo',
  uf: 'SP',
  cep: '',
  fotoBase64: null,
};

export const SEM_ERROS: ErrosFormulario = {
  tipo: '',
  descricao: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
  fotoBase64: '',
};

// ROTAS: um tipo por navigator, com o nome de cada tela e o que ela recebe

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  DetalheOcorrencia: { ocorrencia: Ocorrencia };
};

export type TabParamList = {
  Ocorrencias: undefined;
  Lixeiras: undefined;
  NovaOcorrencia: undefined;
};
