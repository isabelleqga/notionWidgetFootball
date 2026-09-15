# Football Club Widget

<p align="center"><strong>Idiomas:</strong> <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (Brasil)</a></p>

Um widget em tempo real para o Notion (ou qualquer página incorporável) que mostra partidas, classificação, histórico de posições e forma recente de um clube de futebol escolhido em um menu suspenso — qualquer clube entre 9 ligas nacionais em 8 países, via [football-data.org](https://www.football-data.org/).

## 📦 O Que Está Incluído

| Arquivo | Finalidade |
|---|---|
| `server.js` | Servidor backend em Node.js — repassa as chamadas à API e esconde sua chave de API |
| `widget.html` | Widget frontend para o Notion — autocontido, sem etapa de build |
| `package.json` | Dependências do Node.js |
| `.env.example` | Modelo de variáveis de ambiente |

## 🚀 Início Rápido

1. **Baixe o projeto no seu computador** e, de dentro da pasta:
   ```bash
   npm install
   ```
2. **Crie seu arquivo `.env`**:
   ```bash
   cp .env.example .env
   ```
   Depois edite-o:
   ```
   PORT=3000
   API_KEY=your_football_data_org_api_key_here
   ```
   (veja "Chave de API e Segurança" abaixo para saber como obter uma)
3. **Inicie o servidor**:
   ```bash
   npm start
   # ou, com auto-reload durante o desenvolvimento:
   npm run dev
   ```
   Seu servidor agora está rodando em **http://localhost:3000**.
4. **Abra o widget** — acesse `http://localhost:3000/widget`, ou abra o `widget.html` diretamente no seu navegador.

## 🌐 Implantando o Backend

Escolha uma opção e aponte a constante `backendUrl` do `widget.html` para ela.

<details>
<summary><strong>Rede local</strong> — mais fácil, apenas para testes</summary>

- O servidor roda em `http://localhost:3000`
- Defina `const backendUrl = 'http://localhost:3000';` no `widget.html`
- Só funciona no seu próprio computador
</details>

<details>
<summary><strong>Replit</strong> — hospedagem gratuita na nuvem, recomendado</summary>

1. Acesse https://replit.com e crie uma conta
2. Crie um novo Repl de Node.js
3. Envie todos os arquivos do projeto
4. Clique em **Run**
5. Copie a URL do seu Repl (`https://your-replit-name.replit.dev`)
6. Defina `const backendUrl = 'https://your-replit-name.replit.dev';` no `widget.html`
</details>

<details>
<summary><strong>Vercel</strong> — hospedagem gratuita na nuvem</summary>

1. Acesse https://vercel.com e conecte sua conta do GitHub
2. Importe este repositório e faça o deploy
3. Copie a URL do Vercel e defina-a como `backendUrl` no `widget.html`
</details>

<details>
<summary><strong>Heroku</strong> — gratuito com conta</summary>

1. Acesse https://heroku.com e crie um novo app
2. Conecte e faça o deploy deste repositório
3. Copie a URL do Heroku e defina-a como `backendUrl` no `widget.html`
</details>

## 📝 Usando o Widget

**Localmente:** inicie o servidor (`npm start`), abra o widget e escolha um país e depois um clube nos menus suspensos. Os dados são atualizados automaticamente a cada 5 minutos.

**No Notion:**
1. Defina o `backendUrl` no `widget.html` com a URL do seu backend implantado
2. Copie todo o conteúdo do `widget.html`
3. No Notion: **+ Add Block** → **Embed**, depois cole o HTML
4. Escolha um clube — sua escolha é lembrada naquele navegador para a próxima vez, e o seletor se esconde automaticamente depois disso (clique em "Change club" para trazê-lo de volta)

## 🔑 Chave de API e Segurança

- Obtenha uma chave gratuita em https://www.football-data.org/client/register
- Coloque-a no seu arquivo `.env` (veja `.env.example`) — ela é lida apenas no backend e nunca é enviada ao navegador
- O `.env` está no gitignore — **nunca faça commit dele nem o compartilhe publicamente**
- Seguro para incorporar o widget em páginas privadas do Notion

## 📊 Funcionalidades

- Escolha qualquer clube entre Premier League, Championship, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga e Brasileirão
- Últimos 2 resultados + próximos 2 jogos (adversário, mandante/visitante, placar ou horário do jogo em formato 24h)
- Uma única seção de Liga com Tabela (uma janela de 5 times centrada no seu clube, limitada ao topo/fundo da tabela), Evolução na tabela (colorida por zona: candidato ao título / G4 / meio de tabela / rebaixamento, com o número da posição indicado apenas quando ela muda) e Forma — além de uma seção equivalente para a Champions League quando o clube está disputando a competição nesta temporada
- Forma recente em uma grade de quadrados de vitória/empate/derrota/próximo jogo
- Atualização automática a cada 5 minutos
- A escolha do clube é lembrada por navegador (`localStorage`); os menus suspensos de país/clube podem ser ocultados depois que você escolhe um clube (ficam ocultos por padrão depois disso) e podem ser reabertos a qualquer momento pelo link "Change club"
- Um seletor de layout (⚙ ao lado de "Change club") alterna entre **Scroll** (padrão), **Tabs** (uma seção por vez) e **Side-by-side** (seções como cartões lado a lado, esticando para preencher a largura do embed e dividindo a Liga em um cartão de Tabela + um cartão de Posição/Forma) — lembrado por navegador
- Segue a aparência padrão do próprio Notion — mesma fonte e a mesma paleta de cores clara/escura usada nas páginas do Notion
- Compatível com tema claro/escuro, totalmente responsivo — inclusive em colunas estreitas do Notion (a partir de ~240px, por exemplo, uma página dividida em 3 ou mais colunas)

## ⚽ Ligas e Clubes Disponíveis

O elenco exato depende dos dados da temporada atual da football-data.org (acessos, rebaixamentos e mudanças de nome vão alterar isso com o tempo) — isto é o que está disponível para seleção hoje. Qualquer um desses clubes que também esteja disputando a Champions League nesta temporada recebe automaticamente a seção extra da Champions League.

<details>
<summary><strong>⚪🔴⚪ Premier League</strong> — 20 clubes</summary>

<table>
<tr><td>AFC Bournemouth</td><td>Arsenal FC</td><td>Aston Villa FC</td><td>Brentford FC</td></tr>
<tr><td>Brighton &amp; Hove Albion FC</td><td>Chelsea FC</td><td>Coventry City FC</td><td>Crystal Palace FC</td></tr>
<tr><td>Everton FC</td><td>Fulham FC</td><td>Hull City AFC</td><td>Ipswich Town FC</td></tr>
<tr><td>Leeds United FC</td><td>Liverpool FC</td><td>Manchester City FC</td><td>Manchester United FC</td></tr>
<tr><td>Newcastle United FC</td><td>Nottingham Forest FC</td><td>Sunderland AFC</td><td>Tottenham Hotspur FC</td></tr>
</table>
</details>

<details>
<summary><strong>⚪🔴⚪ Championship</strong> — 24 clubes</summary>

<table>
<tr><td>Birmingham City FC</td><td>Blackburn Rovers FC</td><td>Bolton Wanderers FC</td><td>Bristol City FC</td></tr>
<tr><td>Burnley FC</td><td>Cardiff City FC</td><td>Charlton Athletic FC</td><td>Derby County FC</td></tr>
<tr><td>Lincoln City FC</td><td>Middlesbrough FC</td><td>Millwall FC</td><td>Norwich City FC</td></tr>
<tr><td>Portsmouth FC</td><td>Preston North End FC</td><td>Queens Park Rangers FC</td><td>Sheffield United FC</td></tr>
<tr><td>Southampton FC</td><td>Stoke City FC</td><td>Swansea City AFC</td><td>Watford FC</td></tr>
<tr><td>West Bromwich Albion FC</td><td>West Ham United FC</td><td>Wolverhampton Wanderers FC</td><td>Wrexham AFC</td></tr>
</table>
</details>

<details>
<summary><strong>🔴🟡🔴 La Liga</strong> — 20 clubes</summary>

<table>
<tr><td>Athletic Club</td><td>CA Osasuna</td><td>Club Atlético de Madrid</td><td>Deportivo Alavés</td></tr>
<tr><td>Elche CF</td><td>FC Barcelona</td><td>Getafe CF</td><td>Levante UD</td></tr>
<tr><td>Málaga CF</td><td>Rayo Vallecano de Madrid</td><td>RC Celta de Vigo</td><td>RC Deportivo La Coruña</td></tr>
<tr><td>RCD Espanyol de Barcelona</td><td>Real Betis Balompié</td><td>Real Madrid CF</td><td>Real Racing Club de Santander</td></tr>
<tr><td>Real Sociedad de Fútbol</td><td>Sevilla FC</td><td>Valencia CF</td><td>Villarreal CF</td></tr>
</table>
</details>

<details>
<summary><strong>🟢⚪🔴 Serie A</strong> — 20 clubes</summary>

<table>
<tr><td>AC Milan</td><td>AC Monza</td><td>ACF Fiorentina</td><td>AS Roma</td></tr>
<tr><td>Atalanta BC</td><td>Bologna FC 1909</td><td>Cagliari Calcio</td><td>Como 1907</td></tr>
<tr><td>FC Internazionale Milano</td><td>Frosinone Calcio</td><td>Genoa CFC</td><td>Juventus FC</td></tr>
<tr><td>Parma Calcio 1913</td><td>SS Lazio</td><td>SSC Napoli</td><td>Torino FC</td></tr>
<tr><td>Udinese Calcio</td><td>US Lecce</td><td>US Sassuolo Calcio</td><td>Venezia FC</td></tr>
</table>
</details>

<details>
<summary><strong>⚫🔴🟡 Bundesliga</strong> — 18 clubes</summary>

<table>
<tr><td>1. FC Köln</td><td>1. FC Union Berlin</td><td>1. FSV Mainz 05</td><td>Bayer 04 Leverkusen</td></tr>
<tr><td>Borussia Dortmund</td><td>Borussia Mönchengladbach</td><td>Eintracht Frankfurt</td><td>FC Augsburg</td></tr>
<tr><td>FC Bayern München</td><td>FC Schalke 04</td><td>Hamburger SV</td><td>RB Leipzig</td></tr>
<tr><td>SC Freiburg</td><td>SC Paderborn 07</td><td>SV 07 Elversberg</td><td>SV Werder Bremen</td></tr>
<tr><td>TSG 1899 Hoffenheim</td><td>VfB Stuttgart</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🔵⚪🔴 Ligue 1</strong> — 18 clubes</summary>

<table>
<tr><td>AJ Auxerre</td><td>Angers SCO</td><td>AS Monaco FC</td><td>ES Troyes AC</td></tr>
<tr><td>FC Lorient</td><td>Le Havre AC</td><td>Le Mans FC</td><td>Lille OSC</td></tr>
<tr><td>OGC Nice</td><td>Olympique de Marseille</td><td>Olympique Lyonnais</td><td>Paris FC</td></tr>
<tr><td>Paris Saint-Germain FC</td><td>Racing Club de Lens</td><td>RC Strasbourg Alsace</td><td>Stade Brestois 29</td></tr>
<tr><td>Stade Rennais FC 1901</td><td>Toulouse FC</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🟠🟠🟠 Eredivisie</strong> — 18 clubes</summary>

<table>
<tr><td>ADO Den Haag</td><td>AFC Ajax</td><td>AZ</td><td>FC Groningen</td></tr>
<tr><td>FC Twente '65</td><td>FC Utrecht</td><td>Feyenoord Rotterdam</td><td>Fortuna Sittard</td></tr>
<tr><td>Go Ahead Eagles</td><td>NEC</td><td>PEC Zwolle</td><td>PSV</td></tr>
<tr><td>SBV Excelsior</td><td>SC Cambuur-Leeuwarden</td><td>SC Heerenveen</td><td>Sparta Rotterdam</td></tr>
<tr><td>Telstar 1963</td><td>Willem II Tilburg</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🟢🔴🔴 Primeira Liga</strong> — 18 clubes</summary>

<table>
<tr><td>Académico de Viseu FC</td><td>Casa Pia AC</td><td>CD Nacional</td><td>CD Santa Clara</td></tr>
<tr><td>CF Estrela da Amadora</td><td>CS Marítimo</td><td>FC Alverca</td><td>FC Arouca</td></tr>
<tr><td>FC Famalicão</td><td>FC Porto</td><td>GD Estoril Praia</td><td>Gil Vicente FC</td></tr>
<tr><td>Moreirense FC</td><td>Rio Ave FC</td><td>Sport Lisboa e Benfica</td><td>Sporting Clube de Braga</td></tr>
<tr><td>Sporting Clube de Portugal</td><td>Vitória SC</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🟢🟡🔵 Brasileirão</strong> — 20 clubes</summary>

<table>
<tr><td>Botafogo FR</td><td>CA Mineiro</td><td>CA Paranaense</td><td>Chapecoense AF</td></tr>
<tr><td>Clube do Remo</td><td>Coritiba FBC</td><td>CR Flamengo</td><td>CR Vasco da Gama</td></tr>
<tr><td>Cruzeiro EC</td><td>EC Bahia</td><td>EC Vitória</td><td>Fluminense FC</td></tr>
<tr><td>Grêmio FBPA</td><td>Mirassol FC</td><td>RB Bragantino</td><td>Santos FC</td></tr>
<tr><td>São Paulo FC</td><td>SC Corinthians Paulista</td><td>SC Internacional</td><td>SE Palmeiras</td></tr>
</table>
</details>

## 🛠️ Solução de Problemas

| Problema | Solução |
|---|---|
| "Cannot GET /" | O backend não está rodando — execute `npm start` |
| "Failed to fetch" / "Could not reach the backend" | Verifique o `backendUrl` no `widget.html`; confirme que o backend está rodando; verifique o console do navegador em busca de erros |
| Porta já em uso | Altere a `PORT` no `.env`, ou pare o que estiver usando essa porta |
| Os dados não atualizam, ou os menus suspensos ficam vazios | Verifique sua chave de API no `.env`; confirme sua conexão com a internet; verifique o console do navegador |
| "Failed to fetch" ocasional ao trocar de clube rapidamente | Esperado — o plano gratuito da football-data.org permite apenas 10 requisições por minuto. Aguarde alguns segundos e tente novamente |

Ainda com problemas? Abra o console do navegador (F12) para mensagens de erro detalhadas.
