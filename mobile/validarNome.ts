// devolve o texto do erro, ou vazio quando o nome serve.
// O limite de 100 é o mesmo do autorNome na API
export const validarNome = (nome: string): string => {
  const limpo: string = nome.trim();
  if (limpo.length < 3) {
    return 'Mínimo de 3 letras';
  }
  if (limpo.length > 100) {
    return 'Máximo de 100 letras';
  }
  return '';
};
