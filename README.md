# ZelaBairro

## Nome da CitizenTech

ZelaBairro.

## Cidade e bairro

São Paulo, bairro Jardim Paulista.

## Cidadão beneficiado

O morador do bairro, que vê lixeira cheia, lixo jogado na calçada, buraco na rua e poste apagado, mas não tem um jeito simples de avisar e de acompanhar se o problema foi resolvido. A solução também ajuda o agente da subprefeitura, que recebe as ocorrências e consegue ver quais lixeiras estão enchendo.

Eu não fiz entrevista com moradores. Por isso montei o perfil do morador como uma persona, usando dados públicos do SP156 e do GeoSampa. A persona não é uma pessoa real.

## Problema, em uma frase

As lixeiras e caçambas do bairro transbordam antes da coleta, e os moradores não têm como avisar nem acompanhar a solução de problemas como lixo irregular, buracos e poste apagado.

## Como funciona

Um sensor de distância na lixeira mede o quanto ela está cheia e manda a leitura para uma API. Um modelo de IA usa essas informações para prever se a lixeira vai transbordar nas próximas 24 horas. O morador registra uma ocorrência com foto pelo app ou pelo portal e acompanha o status dela. Na subprefeitura, o agente usa um programa no computador que funciona sem internet.

## O que cada parte faz

- [api](api/): API em Spring Boot com MySQL. Guarda as lixeiras, as leituras do sensor, as ocorrências e as previsões. As outras partes conversam com ela.
- iot: ESP32 com o sensor HC-SR04 no Wokwi. Mede o nível da lixeira e envia por MQTT. O Node-RED recebe a mensagem e manda para a API.
- ia: notebook em Python com uma árvore de decisão. Prevê se a lixeira vai transbordar em 24 horas e envia a previsão para a API.
- [mobile](mobile/): app em React Native para o morador abrir ocorrências com foto e ver as lixeiras.
- portal: página em HTML e JavaScript que mostra as ocorrências e as lixeiras. Fica hospedada no IIS.
- desktop: programa em C# para a subprefeitura cadastrar ocorrências recebidas por telefone. Funciona sem internet e salva os dados em CSV. Fica em um repositório separado.
- infra: configuração do Windows Server com AD, DNS e IIS.
- docs: relatório de segurança, diagrama Archimate e documento de TQA.

## Link do repositório

https://github.com/Lucascortizo/zelabairro

Parte em C#: https://github.com/Lucascortizo/zelabairro-desktop

## Indicador de impacto

Escolhi dois indicadores:

- a porcentagem de lixeiras esvaziadas antes de chegar a 100% de nível;
- o tempo médio, em dias, entre abrir uma ocorrência e ela ser resolvida.

## ODS conectados

- ODS 11, Cidades e comunidades sustentáveis: o bairro fica mais limpo e os moradores participam da zeladoria.
- ODS 3, Saúde e bem-estar: lixo acumulado atrai ratos e insetos e espalha doenças.
- ODS 13, Ação contra a mudança global do clima: incentiva o descarte correto do lixo.

## Integrante

Lucas Cortizo, RM 559734.
