# Decisões do app mobile

Aqui eu explico as escolhas que fiz no app e por quê. Lucas Cortizo, RM 559734.

## Ponto de partida

Comecei pelo boilerplate da aula 08 (ficha-login-lista) e mantive o mesmo jeito de organizar: telas em screens, componentes em components, navegação em navigation, tipos em types.ts e estilos com StyleSheet. Assim eu sei explicar cada parte, porque é a mesma estrutura que usei em aula.

## Navegação

O boilerplate tinha stack, drawer e tabs. Eu tirei o drawer. O app tem cinco telas: Login, Ocorrências, Detalhe, Lixeiras e Nova ocorrência. Três delas ficam em abas embaixo (Ocorrências, Lixeiras e Nova), e elas cabem bem ali. O drawer só deixaria o menu mais escondido.

Ficou assim: um stack na raiz com Login, Home e Detalhe. Dentro de Home ficam as abas. O Detalhe fica no stack, por cima das abas, porque é uma tela que a pessoa abre e depois volta. Cada navigator tem um tipo em types.ts com as rotas e o que cada uma recebe. Por isso o TypeScript avisa se eu navegar para uma tela que não existe ou esquecer um parâmetro.

## Identificação lembrada

O nome do morador fica salvo no AsyncStorage, como na aula. Mudei uma coisa: no boilerplate o login só preenchia o campo com o nome salvo. No meu app, se já existe um nome, o login vai direto para as abas. Achei mais natural, porque o morador não precisa entrar de novo toda vez que abre o app. Enquanto o app confere o nome, aparece um carregando, para a tela de login não piscar.

O botão Sair fica no topo de todas as abas. Ele apaga o nome e volta para o login.

O nome salvo também é usado como autor da ocorrência. Assim o morador não precisa digitar o nome de novo no formulário.

## Chamadas à API

Todas as chamadas ficam em services/api.ts, com o endereço da API numa constante só (API_URL). Se o IP do computador mudar, eu troco em um lugar. As telas não usam fetch direto: elas chamam funções como listarOcorrencias e criarOcorrencia.

Quando a lixeira ainda não tem previsão, a API responde 404. Nesse caso a função devolve null e a tela mostra "ainda sem previsão", em vez de tratar como erro.

## Listas e estados

As listas usam FlatList. Cada uma tem três estados além da lista em si: carregando, erro (com um botão para tentar de novo) e vazia. As listas recarregam toda vez que a aba aparece. Assim, depois de criar uma ocorrência, ela já está na lista quando a pessoa volta. Também dá para puxar a lista para baixo para atualizar, o que ajuda a ver o nível novo que o sensor mandou.

## Formulário e validação

A validação fica em funções puras, em arquivos separados (validarNome.ts e validarOcorrencia.ts). Elas recebem os dados e devolvem os erros, sem mexer em tela nem em estado. Usei regras compatíveis com a API: tipo obrigatório, descrição de 10 a 500 letras, rua, bairro e cidade obrigatórios, UF com 2 letras, CEP no formato 00000-000 e foto até o tamanho que a API aceita. Assim o morador vê o erro embaixo do campo antes de enviar, e a API não recebe dado errado.

Bairro, cidade e UF já vêm preenchidos com Jardim Paulista, São Paulo e SP, porque o app é do bairro. O morador pode mudar se precisar.

## Foto e permissão

A foto vem da galeria com o expo-image-picker. Quando a pessoa toca em Escolher foto, o app primeiro confere se a permissão já foi dada. Se já foi, a galeria abre direto. Se ainda não, aparece uma mensagem explicando que o app usa a galeria só para anexar uma foto do problema. O pedido do sistema só aparece depois que a pessoa toca em Continuar.

Se a pessoa negar, aparece um aviso dizendo que a foto é opcional, com um botão Abrir ajustes. Ele chama Linking.openSettings() e leva direto para as configurações do app. Fiz isso porque, depois de negado, o celular não mostra o pedido de novo, e a única forma de liberar é pelos ajustes. O app continua funcionando sem foto.

No app.json, coloquei o texto da permissão de fotos (photosPermission). É a explicação que o sistema mostra quando o app é instalado fora do Expo Go.

A foto vai para a API como texto em base64, no formato "data:image/jpeg;base64,...". Escolhi esse formato porque o app e o portal conseguem mostrar a imagem direto, sem montar nada. Para a foto ficar leve, uso qualidade baixa (0.3) e corte na hora de escolher.

## TypeScript estrito

O tsconfig usa strict, e o código não tem nenhum any. Os dados da API têm tipos em types.ts com os mesmos nomes do contrato (Ocorrencia, Lixeira, Previsao). O tsc --noEmit roda limpo.

## Visual

Troquei o rosa da aula por uma paleta própria do ZelaBairro, toda no theme.ts. A cor principal é um verde, que combina com limpeza e cuidado com o bairro. Amarelo e vermelho aparecem só como alerta. O nível das lixeiras usa as mesmas faixas dos LEDs do ESP32: verde abaixo de 50%, amarelo de 50% a 80% e vermelho acima de 80%. O status das ocorrências tem uma etiqueta colorida: vermelha quando está aberta, amarela em andamento e verde quando foi resolvida.

Para os ícones, usei a biblioteca @expo/vector-icons, com o conjunto Ionicons. Escolhi essa biblioteca por quatro motivos:

- ela já faz parte do ecossistema do Expo e instalei com npx expo install, do mesmo jeito que aprendi em aula;
- funciona no Expo Go sem nenhuma configuração nativa;
- os nomes dos ícones são tipados, então um nome errado vira erro no tsc;
- os ícones deixam o tipo da ocorrência e o nível da lixeira mais fáceis de reconhecer do que só o texto.

## O que deixei de fora

O app não muda o status das ocorrências. Quem faz isso é a subprefeitura. Também não usei a câmera: a rubrica pede um recurso nativo com permissão, e a galeria já atende.
