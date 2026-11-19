// Endereço da API. Ao hospedar no IIS da VM, troque localhost pelo IP do PC onde a API roda
const API_URL = "http://localhost:8080";

// ---------- Textos para mostrar no lugar dos códigos da API ----------

const NOME_TIPO_LIXEIRA = {
  LIXEIRA: "Lixeira",
  CACAMBA: "Caçamba",
};

const NOME_TIPO_OCORRENCIA = {
  LIXO_IRREGULAR: "Lixo irregular",
  LIXEIRA_CHEIA: "Lixeira cheia",
  BURACO: "Buraco",
  POSTE_APAGADO: "Poste apagado",
  OUTRO: "Outro",
};

const NOME_STATUS = {
  ABERTA: "Aberta",
  EM_ANDAMENTO: "Em andamento",
};

const CLASSE_STATUS = {
  ABERTA: "status-aberta",
  EM_ANDAMENTO: "status-andamento",
};

// ---------- Funções de apoio ----------

// Cria um elemento e coloca o texto com textContent.
// O textContent trata tudo como texto puro: se a API mandar "<script>", aparece escrito na tela e não roda.
function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

// "2026-11-17T12:05:34" (formato da API) vira "17/11/2026 12:05"
function formatarData(dataIso) {
  const [data, hora] = dataIso.split("T");
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} ${hora.slice(0, 5)}`;
}

// Logradouro, número (quando tem) e bairro
function resumirEndereco(endereco) {
  let texto = endereco.logradouro;
  if (endereco.numero) {
    texto += `, ${endereco.numero}`;
  }
  return `${texto}, ${endereco.bairro}`;
}

// Mesmas faixas dos LEDs do iot/sketch.ino: vermelho acima de 80, amarelo a partir de 50, verde abaixo
function classeDoNivel(nivel) {
  if (nivel > 80) {
    return "nivel-vermelho";
  }
  if (nivel >= 50) {
    return "nivel-amarelo";
  }
  return "nivel-verde";
}

// Mostra o aviso da seção (carregando, erro ou vazio). O tipo vira uma classe do CSS
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
  elemento.hidden = false;
}

function esconderMensagem(elemento) {
  elemento.hidden = true;
}

// ---------- Lixeiras ----------

function criarCartaoLixeira(lixeira) {
  // Garante um número de 0 a 100 antes de usar na largura da barra
  const nivel = Math.min(100, Math.max(0, Number(lixeira.nivelAtual) || 0));
  const classeNivel = classeDoNivel(nivel);

  const cartao = criarElemento("article", "cartao");

  const topo = criarElemento("div", "cartao-topo");
  topo.appendChild(criarElemento("strong", "", lixeira.codigo));
  topo.appendChild(criarElemento("span", "etiqueta", NOME_TIPO_LIXEIRA[lixeira.tipo] || lixeira.tipo));
  cartao.appendChild(topo);

  cartao.appendChild(criarElemento("p", "detalhe", resumirEndereco(lixeira.endereco)));

  const barraFundo = criarElemento("div", "barra-fundo");
  barraFundo.setAttribute("role", "progressbar");
  barraFundo.setAttribute("aria-valuemin", "0");
  barraFundo.setAttribute("aria-valuemax", "100");
  barraFundo.setAttribute("aria-valuenow", String(nivel));
  const barra = criarElemento("div", `barra ${classeNivel}`);
  barra.style.width = `${nivel}%`;
  barraFundo.appendChild(barra);
  cartao.appendChild(barraFundo);

  cartao.appendChild(criarElemento("p", `nivel-texto ${classeNivel}`, `${nivel}% cheia`));
  return cartao;
}

async function carregarLixeiras() {
  const lista = document.getElementById("lista-lixeiras");
  const mensagem = document.getElementById("mensagem-lixeiras");
  const botao = document.getElementById("atualizar-lixeiras");

  // Limpa a lista sem usar innerHTML
  lista.replaceChildren();
  mostrarMensagem(mensagem, "Carregando lixeiras...", "carregando");
  botao.disabled = true;

  try {
    const resposta = await fetch(`${API_URL}/lixeiras?page=0&size=50&sort=codigo`);
    if (!resposta.ok) {
      throw new Error(`A API respondeu ${resposta.status}`);
    }
    const pagina = await resposta.json();
    const lixeiras = pagina.content;

    if (lixeiras.length === 0) {
      mostrarMensagem(mensagem, "Nenhuma lixeira cadastrada.", "vazio");
      return;
    }
    for (const lixeira of lixeiras) {
      lista.appendChild(criarCartaoLixeira(lixeira));
    }
    esconderMensagem(mensagem);
  } catch (erro) {
    console.error(erro);
    mostrarMensagem(mensagem, `Não consegui falar com a API em ${API_URL}. Confira se ela está rodando e clique em Atualizar.`, "erro");
  } finally {
    botao.disabled = false;
  }
}

// ---------- Ocorrências abertas ----------

function criarCartaoOcorrencia(ocorrencia) {
  const cartao = criarElemento("article", "cartao");

  const topo = criarElemento("div", "cartao-topo");
  topo.appendChild(criarElemento("strong", "", NOME_TIPO_OCORRENCIA[ocorrencia.tipo] || ocorrencia.tipo));
  const classeStatus = CLASSE_STATUS[ocorrencia.status] || "";
  topo.appendChild(criarElemento("span", `etiqueta ${classeStatus}`, NOME_STATUS[ocorrencia.status] || ocorrencia.status));
  cartao.appendChild(topo);

  cartao.appendChild(criarElemento("p", "", ocorrencia.descricao));
  const detalhe = `${ocorrencia.endereco.bairro} · aberta em ${formatarData(ocorrencia.dataAbertura)}`;
  cartao.appendChild(criarElemento("p", "detalhe", detalhe));
  return cartao;
}

async function carregarOcorrencias() {
  const lista = document.getElementById("lista-ocorrencias");
  const mensagem = document.getElementById("mensagem-ocorrencias");
  const botao = document.getElementById("atualizar-ocorrencias");

  lista.replaceChildren();
  mostrarMensagem(mensagem, "Carregando ocorrências...", "carregando");
  botao.disabled = true;

  try {
    const resposta = await fetch(`${API_URL}/ocorrencias?page=0&size=50&sort=dataAbertura,desc`);
    if (!resposta.ok) {
      throw new Error(`A API respondeu ${resposta.status}`);
    }
    const pagina = await resposta.json();
    // A API devolve todas as ocorrências ativas; aqui ficam só as que não foram resolvidas
    const abertas = pagina.content.filter((ocorrencia) => ocorrencia.status !== "RESOLVIDA");

    if (abertas.length === 0) {
      mostrarMensagem(mensagem, "Nenhuma ocorrência aberta no momento.", "vazio");
      return;
    }
    for (const ocorrencia of abertas) {
      lista.appendChild(criarCartaoOcorrencia(ocorrencia));
    }
    esconderMensagem(mensagem);
  } catch (erro) {
    console.error(erro);
    mostrarMensagem(mensagem, `Não consegui falar com a API em ${API_URL}. Confira se ela está rodando e clique em Atualizar.`, "erro");
  } finally {
    botao.disabled = false;
  }
}

// ---------- Início ----------

// O script tem defer no HTML, então a página já está montada quando este código roda
document.getElementById("atualizar-lixeiras").addEventListener("click", carregarLixeiras);
document.getElementById("atualizar-ocorrencias").addEventListener("click", carregarOcorrencias);
carregarLixeiras();
carregarOcorrencias();
