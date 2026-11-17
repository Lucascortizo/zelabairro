# ZelaBairro Mobile

App do morador da ZelaBairro, feito em React Native com Expo para a Global Solution 2026.2 (CitizenTech). Com ele o morador avisa problemas do bairro com foto e vê o nível das lixeiras.

## Ficha da CitizenTech

Nome da CitizenTech: ZelaBairro.

Cidade e bairro: São Paulo, bairro Jardim Paulista.

Cidadão beneficiado: o morador do bairro, que vê lixeira cheia, lixo na calçada, buraco e poste apagado, mas não tem um jeito simples de avisar e de acompanhar a solução. Eu não fiz entrevista com moradores. O perfil do morador é uma persona montada com dados públicos do SP156 e do GeoSampa, e não é uma pessoa real.

Problema, em uma frase: as lixeiras e caçambas do bairro transbordam antes da coleta, e os moradores não têm como avisar nem acompanhar a solução de problemas como lixo irregular, buracos e poste apagado.

Como funciona: o morador entra com o nome, vê as ocorrências do bairro e o nível de cada lixeira, que vem do sensor no ESP32. Junto do nível aparece a previsão da IA, que diz se a lixeira vai transbordar nas próximas 24 horas. Ele também abre uma ocorrência nova com foto da galeria. Tudo é salvo na API do projeto.

Link do repositório: https://github.com/Lucascortizo/zelabairro (este app fica na pasta mobile).

Indicador de impacto: o tempo médio, em dias, entre abrir uma ocorrência e ela ser resolvida, e a porcentagem de lixeiras esvaziadas antes de chegar a 100%.

ODS conectados: 11 (Cidades e comunidades sustentáveis), 3 (Saúde e bem-estar) e 13 (Ação contra a mudança global do clima).

Integrante: Lucas Cortizo, RM 559734.

## Telas

- Login: pede o nome do morador e lembra dele ao reabrir o app. O botão Sair, no topo, apaga o nome.
- Ocorrências: lista as ocorrências do bairro, com tipo e status. Mostra mensagens de carregando, de erro e de lista vazia.
- Detalhe: todos os dados da ocorrência, o status e a foto, se tiver.
- Lixeiras: o nível de cada lixeira em uma barra colorida e a previsão da IA.
- Nova ocorrência: formulário com validação e foto da galeria.

## Tecnologias

- React Native com Expo e TypeScript estrito
- React Navigation (stack e tabs)
- AsyncStorage, para lembrar o nome
- expo-image-picker, para a foto da galeria
- @expo/vector-icons, para os ícones

## Como rodar

É preciso ter o Node.js LTS no computador e o app Expo Go no celular. O celular e o computador precisam estar na mesma rede Wi-Fi.

1. Deixe a API rodando. O passo a passo está no [README da API](../api/README.md).
2. Em services/api.ts, troque o IP da constante API_URL pelo IP do seu computador na rede. No Windows, o IP aparece no comando ipconfig, na linha "Endereço IPv4".
3. Para conferir, abra http://SEU_IP:8080/healthcheck no navegador do celular. Se não abrir, libere a porta 8080 no Firewall do Windows.
4. Dentro da pasta mobile, instale as dependências e inicie o Expo:

   ```
   npm install
   npx expo start
   ```

5. Leia o QR code com o Expo Go.

Para conferir os tipos do TypeScript:

```
npx tsc --noEmit
```
