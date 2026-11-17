# IA: previsão de transbordo das lixeiras

Parte de IA & ML do ZelaBairro. Lucas Cortizo, RM 559734.

## Problema

As lixeiras e caçambas do bairro transbordam antes da coleta. Eu quis prever, para cada lixeira, se ela vai transbordar nas próximas 24 horas. É uma classificação com duas respostas: 1 (vai transbordar) ou 0 (não vai).

A previsão é enviada para a API do projeto e aparece no app e no portal. Assim a subprefeitura sabe onde mandar o caminhão primeiro.

Arquivos desta pasta:

- zelabairro_ia.ipynb: o notebook com todas as etapas
- dataset.csv: os dados simulados, gerados pelo notebook
- modelo.pkl: o modelo treinado, salvo pelo notebook

## Origem dos dados

Os dados são simulados. Eu não tenho dados reais de sensores de lixeira, então gerei 1.000 leituras no próprio notebook, usando uma regra e um pouco de ruído.

As colunas são:

- dia_semana: 0 (segunda) a 6 (domingo)
- hora: 0 a 23
- tipo_local: residencial, comercial ou feira
- dia_de_feira: 1 quando o local é de feira e o dia é quarta ou sábado
- nivel_atual: quanto a lixeira está cheia, de 0 a 100%
- dias_desde_coleta: 0 a 6
- transborda_24h: o alvo, 0 ou 1

A regra soma pontos. Começa com o nível atual e soma 6 pontos por dia sem coleta, mais 10 se o local for comercial e mais 25 em dia de feira. Depois soma um ruído entre -10 e 10, porque na vida real nada é exato. Se der 100 pontos ou mais, transborda_24h vale 1.

A hora não entra na regra. Deixei ela no dataset para ver se o modelo percebe que ela não importa.

Usei random.seed(42), então o dataset sai igual toda vez que o notebook roda. No final ficaram 736 leituras que não transbordam e 264 que transbordam (26%).

## Decisões

- Escolhi a árvore de decisão (DecisionTreeClassifier) porque é um modelo simples e dá para explicar cada previsão como uma sequência de perguntas, por exemplo "o nível é maior que 70?".
- Limitei a árvore a 5 níveis (max_depth=5). Sem limite ela decora o treino, até o ruído, e erra mais com dados novos.
- Troquei tipo_local por 0, 1 e 2 com um dicionário, porque a árvore só trabalha com números.
- Separei 80% para treino e 20% para teste, com stratify para manter a mesma proporção de 0 e 1 nas duas partes.
- Na integração, o nível vem do nivelAtual de cada lixeira, que o ESP32 atualiza pelo Node-RED. O dia e a hora vêm do relógio do computador. A API não guarda o tipo do local nem a data da última coleta, então usei valores fixos: residencial e 2 dias.

## Resultado

O modelo acertou 91,5% das 200 linhas de teste. Para comparar, um modelo que respondesse sempre "não transborda" acertaria cerca de 74%.

Na matriz de confusão:

- acertou 143 que não transbordam e 40 que transbordam
- deu 4 alarmes falsos (previu transbordo e não aconteceu)
- deixou passar 13 transbordos

Deixar passar um transbordo é o erro mais grave, porque a lixeira enche sem aviso. Um alarme falso só faz o caminhão passar antes da hora. Os erros vêm do ruído da regra: perto dos 100 pontos, leituras parecidas às vezes transbordam e às vezes não.

As colunas mais importantes para a árvore foram o nível atual (0,69) e os dias desde a coleta (0,20), como na regra. A hora ficou perto de zero (0,006).

## Como rodar

1. Instale o Python 3 e as bibliotecas:

   ```
   pip install pandas scikit-learn matplotlib joblib requests ipykernel
   ```

2. No VS Code, instale as extensões Python e Jupyter.
3. Abra o zelabairro_ia.ipynb e escolha o kernel do Python em "Select Kernel".
4. A etapa 8 envia as previsões para a API, então ela precisa estar rodando em localhost:8080. O passo a passo está no [README da API](../api/README.md).
5. Clique em "Run All". O dataset.csv e o modelo.pkl são criados nesta pasta.
6. Para conferir, abra GET http://localhost:8080/previsoes?lixeiraId=2 no Insomnia ou no navegador.

Também dá para rodar tudo pelo terminal, na pasta zelabairro, com:

```
jupyter nbconvert --to notebook --execute --inplace ia/zelabairro_ia.ipynb
```
