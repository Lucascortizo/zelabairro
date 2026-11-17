import { type ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusOcorrencia, TipoOcorrencia } from './types';

// o tipo com todos os nomes de ícone que o Ionicons conhece: um nome errado vira erro no tsc
export type NomeIcone = ComponentProps<typeof Ionicons>['name'];

export const ICONE_TIPO: Record<TipoOcorrencia, NomeIcone> = {
  LIXO_IRREGULAR: 'trash-bin',
  LIXEIRA_CHEIA: 'trash',
  BURACO: 'construct',
  POSTE_APAGADO: 'bulb',
  OUTRO: 'help-circle',
};

export const ICONE_STATUS: Record<StatusOcorrencia, NomeIcone> = {
  ABERTA: 'alert-circle',
  EM_ANDAMENTO: 'time',
  RESOLVIDA: 'checkmark-circle',
};

// mesmas faixas de corDoNivel: tranquila, atenção e quase transbordando
export const iconeDoNivel = (nivel: number): NomeIcone => {
  if (nivel > 80) {
    return 'warning';
  }
  if (nivel >= 50) {
    return 'alert-circle';
  }
  return 'checkmark-circle';
};
