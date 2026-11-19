# ZelaBairro: infraestrutura Windows Server (Operating Systems)

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

## O que é esta parte

Aqui está a infraestrutura que hospeda o portal web do ZelaBairro. Eu montei um Windows Server numa máquina virtual, com domínio, DNS e IIS. O portal fica no IIS e busca os dados na API Spring Boot, que roda no meu computador.

O caminho de uma visita é este: o navegador abre http://zelabairro.corp.local, o DNS do servidor responde com o IP da VM, o IIS entrega o portal, e o JavaScript do portal busca as lixeiras e as ocorrências na API.

## Ambiente

- VirtualBox com uma VM chamada SRV01
- Windows Server 2025 Standard Evaluation (Desktop Experience)
- 4 GB de memória, 2 CPUs e disco de 50 GB
- Rede NAT, com IP fixo 10.0.2.15, gateway 10.0.2.2 e DNS no próprio servidor
- Domínio corp.local

Eu tentei usar uma segunda placa de rede (host-only), mas o VirtualBox deu erro ao criar a rede no meu computador. Por isso usei só o NAT. No NAT do VirtualBox, o endereço 10.0.2.2 é o meu computador. Então o portal dentro da VM acessa a API em http://10.0.2.2:8080. No repositório, o portal/app.js continua com localhost. Eu troquei o endereço só na cópia que está na VM.

## Roteiro de configuração

### 1. Rede e identidade

Configurei o IP fixo pela interface (ncpa.cpl): 10.0.2.15, máscara 255.255.255.0, gateway 10.0.2.2. Depois troquei o nome do servidor e criei o domínio com DNS:

    Rename-Computer -NewName SRV01 -Restart
    Install-WindowsFeature AD-Domain-Services, DNS, Web-Server -IncludeManagementTools
    Install-ADDSForest -DomainName corp.local -DomainNetbiosName CORP -InstallDns -Force

Para conferir, usei hostname, ipconfig /all e Get-ADDomain.

Evidências: 01-hostname-ipconfig.png e 02-dominio-ad.png

### 2. DNS

Criei o nome do site apontando para o servidor e um encaminhador para a VM continuar acessando a internet:

    Add-DnsServerResourceRecordA -ZoneName corp.local -Name zelabairro -IPv4Address 10.0.2.15
    Add-DnsServerForwarder -IPAddress 10.0.2.3
    nslookup zelabairro.corp.local

Evidências: 03-nslookup.png e 04-dns-zona.png

### 3. Site no IIS

Criei a pasta C:\Sites\ZelaBairro e copiei para ela os arquivos da pasta portal/ (index.html, style.css e app.js). O portal é só HTML, CSS e JavaScript, então a única dependência é o IIS com conteúdo estático, que já vem com o Web-Server. Por isso o pool fica sem .NET (No Managed Code).

    New-WebAppPool -Name ZelaBairroPool
    Set-ItemProperty IIS:\AppPools\ZelaBairroPool -Name managedRuntimeVersion -Value ""
    New-Website -Name ZelaBairro -HostHeader zelabairro.corp.local -Port 80 -PhysicalPath C:\Sites\ZelaBairro -ApplicationPool ZelaBairroPool

Evidência: 05-iis-site.png

### 4. Permissões NTFS

Tirei a herança da pasta e deixei só quem precisa. O IIS e o pool só podem ler. Para alterar os arquivos do site, criei o grupo GG_Web_Admins no domínio.

    New-ADGroup -Name GG_Web_Admins -GroupScope Global
    icacls C:\Sites\ZelaBairro /inheritance:r /grant "Administrators:(OI)(CI)F" "SYSTEM:(OI)(CI)F" "CORP\GG_Web_Admins:(OI)(CI)M" "IIS AppPool\ZelaBairroPool:(OI)(CI)RX" "IUSR:(OI)(CI)RX"

Assim, mesmo que alguém consiga explorar o site, a conta do IIS não consegue gravar arquivos na pasta.

Evidência: 06-ntfs.png

### 5. Teste de conexão e funcionamento

    Test-NetConnection zelabairro.corp.local -Port 80
    Test-NetConnection 10.0.2.2 -Port 8080

O primeiro testa o site no IIS e o segundo testa a API no meu computador. Os dois deram TcpTestSucceeded True. Depois abri o portal no Edge da VM e ele mostrou as lixeiras e as ocorrências vindas da API.

Evidências: 07-test-netconnection.png e 08-portal-no-iis.png

### 6. Monitoramento

Criei um conjunto de alertas no Monitor de Desempenho. Ele confere os valores a cada 15 segundos e grava um evento quando algum passa do limite.

    logman create alert ZelaBairro_Alertas -th "\Processor(_Total)\% Processor Time>80" "\Memory\Available MBytes<500" "\LogicalDisk(C:)\% Free Space<15" -si 00:00:15 -el
    logman start ZelaBairro_Alertas

Os limites são CPU acima de 80%, menos de 500 MB de memória livre e menos de 15% de espaço livre no disco C:. Para testar, deixei a CPU em 100% com dois loops em PowerShell. O alerta apareceu no Visualizador de Eventos (Diagnosis-PLA, evento 2031).

Evidências: 09-perfmon-alertas.png e 10-alerta-cpu-evento.png

### 7. Tolerância a falhas e teste de falha

No pool, ativei o início automático e deixei o Rapid-Fail Protection ligado (padrão do IIS: até 5 falhas em 5 minutos):

    Set-ItemProperty IIS:\AppPools\ZelaBairroPool -Name startMode -Value AlwaysRunning
    Set-ItemProperty IIS:\AppPools\ZelaBairroPool -Name autoStart -Value $true

Nos serviços do IIS, configurei a recuperação para reiniciar depois de 5 segundos:

    sc.exe failure W3SVC reset= 86400 actions= restart/5000/restart/5000/restart/5000
    sc.exe failure WAS reset= 86400 actions= restart/5000/restart/5000/restart/5000

Teste do pool: derrubei o processo w3wp com Stop-Process. O IIS criou outro processo sozinho, com outro número, e o portal continuou funcionando. O Visualizador de Eventos registrou a queda (WAS, evento 5009).

Teste do serviço: derrubei o processo do W3SVC. O serviço não voltou sozinho. No log, o Windows registrou como uma parada normal (evento 7036) e não como falha, por isso a regra de recuperação não foi usada. Eu religuei com Start-Service. A recuperação do serviço está configurada, mas nesse teste ela não foi acionada.

Evidências: 11-recuperacao-servico.png, 12-teste-falha-pool.png, 13-recuperacao-servico-interface.png, 14-eventos-falha.png e 16-teste-servico-sem-recuperacao.png

### 8. Logs

Usei o Visualizador de Eventos para acompanhar os alertas (Diagnosis-PLA) e as falhas (System). O IIS grava cada acesso em C:\inetpub\logs\LogFiles\W3SVC2, com data, hora, IP, página pedida e código de resposta.

Evidência: 15-log-iis.png

## Vídeo

