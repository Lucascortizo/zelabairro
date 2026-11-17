import { type JSX } from 'react';
import { Ionicons } from '@expo/vector-icons';

// a tab bar entrega a cor, o tamanho e se a aba está ativa. Ativa: ícone cheio; inativa: só o contorno
interface IconeTabProps {
  focused: boolean;
  color: string;
  size: number;
}

export const IconeOcorrencias = ({ focused, color, size }: IconeTabProps): JSX.Element => {
  return <Ionicons name={focused ? 'megaphone' : 'megaphone-outline'} size={size} color={color} />;
};

export const IconeLixeiras = ({ focused, color, size }: IconeTabProps): JSX.Element => {
  return <Ionicons name={focused ? 'trash' : 'trash-outline'} size={size} color={color} />;
};

export const IconeNova = ({ focused, color, size }: IconeTabProps): JSX.Element => {
  return <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={size} color={color} />;
};
