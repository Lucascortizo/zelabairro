import { DarkTheme, Theme } from '@react-navigation/native';

// PALETA DO ZELABAIRRO: verde de praça como cor principal, fundo escuro puxado para o verde.
// Amarelo e vermelho só para alerta, nas mesmas faixas dos LEDs do ESP32
export const CORES = {
  primaria: '#2BB673',
  primariaSuave: 'rgba(43,182,115,0.18)',
  fundo: '#0F1512',
  cartao: '#18211C',
  borda: '#27352D',
  texto: '#E8F1EC',
  apagado: '#93A59A',
  textoBotao: '#FFFFFF',
  erro: '#FF6B6B',
  amarelo: '#F2C94C',
  amareloSuave: 'rgba(242,201,76,0.18)',
  vermelho: '#EB5757',
  vermelhoSuave: 'rgba(235,87,87,0.18)',
};

// o tema escuro da navegação: header e tab bar usam estas cores sozinhos
export const NAV_THEME: Theme = {
  ...DarkTheme,
  colors: {
    primary: CORES.primaria,
    background: CORES.fundo,
    card: CORES.cartao,
    text: CORES.texto,
    border: CORES.borda,
    notification: CORES.primaria,
  },
};
