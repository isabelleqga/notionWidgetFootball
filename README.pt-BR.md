# Football Club Widget

**Idiomas:** [English](README.md) | [Português (Brasil)](README.pt-BR.md)

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
<summary><strong>Premier League</strong> (Inglaterra) — 20 clubes</summary>

AFC Bournemouth, Arsenal FC, Aston Villa FC, Brentford FC, Brighton & Hove Albion FC, Chelsea FC, Coventry City FC, Crystal Palace FC, Everton FC, Fulham FC, Hull City AFC, Ipswich Town FC, Leeds United FC, Liverpool FC, Manchester City FC, Manchester United FC, Newcastle United FC, Nottingham Forest FC, Sunderland AFC, Tottenham Hotspur FC
</details>

<details>
<summary><strong>Championship</strong> (Inglaterra) — 24 clubes</summary>

Birmingham City FC, Blackburn Rovers FC, Bolton Wanderers FC, Bristol City FC, Burnley FC, Cardiff City FC, Charlton Athletic FC, Derby County FC, Lincoln City FC, Middlesbrough FC, Millwall FC, Norwich City FC, Portsmouth FC, Preston North End FC, Queens Park Rangers FC, Sheffield United FC, Southampton FC, Stoke City FC, Swansea City AFC, Watford FC, West Bromwich Albion FC, West Ham United FC, Wolverhampton Wanderers FC, Wrexham AFC
</details>

<details>
<summary><strong>La Liga</strong> (Espanha) — 20 clubes</summary>

Athletic Club, CA Osasuna, Club Atlético de Madrid, Deportivo Alavés, Elche CF, FC Barcelona, Getafe CF, Levante UD, Málaga CF, Rayo Vallecano de Madrid, RC Celta de Vigo, RC Deportivo La Coruña, RCD Espanyol de Barcelona, Real Betis Balompié, Real Madrid CF, Real Racing Club de Santander, Real Sociedad de Fútbol, Sevilla FC, Valencia CF, Villarreal CF
</details>

<details>
<summary><strong>Serie A</strong> (Itália) — 20 clubes</summary>

AC Milan, AC Monza, ACF Fiorentina, AS Roma, Atalanta BC, Bologna FC 1909, Cagliari Calcio, Como 1907, FC Internazionale Milano, Frosinone Calcio, Genoa CFC, Juventus FC, Parma Calcio 1913, SS Lazio, SSC Napoli, Torino FC, Udinese Calcio, US Lecce, US Sassuolo Calcio, Venezia FC
</details>

<details>
<summary><strong>Bundesliga</strong> (Alemanha) — 18 clubes</summary>

1. FC Köln, 1. FC Union Berlin, 1. FSV Mainz 05, Bayer 04 Leverkusen, Borussia Dortmund, Borussia Mönchengladbach, Eintracht Frankfurt, FC Augsburg, FC Bayern München, FC Schalke 04, Hamburger SV, RB Leipzig, SC Freiburg, SC Paderborn 07, SV 07 Elversberg, SV Werder Bremen, TSG 1899 Hoffenheim, VfB Stuttgart
</details>

<details>
<summary><strong>Ligue 1</strong> (França) — 18 clubes</summary>

AJ Auxerre, Angers SCO, AS Monaco FC, ES Troyes AC, FC Lorient, Le Havre AC, Le Mans FC, Lille OSC, OGC Nice, Olympique de Marseille, Olympique Lyonnais, Paris FC, Paris Saint-Germain FC, Racing Club de Lens, RC Strasbourg Alsace, Stade Brestois 29, Stade Rennais FC 1901, Toulouse FC
</details>

<details>
<summary><strong>Eredivisie</strong> (Holanda) — 18 clubes</summary>

ADO Den Haag, AFC Ajax, AZ, FC Groningen, FC Twente '65, FC Utrecht, Feyenoord Rotterdam, Fortuna Sittard, Go Ahead Eagles, NEC, PEC Zwolle, PSV, SBV Excelsior, SC Cambuur-Leeuwarden, SC Heerenveen, Sparta Rotterdam, Telstar 1963, Willem II Tilburg
</details>

<details>
<summary><strong>Primeira Liga</strong> (Portugal) — 18 clubes</summary>

Académico de Viseu FC, Casa Pia AC, CD Nacional, CD Santa Clara, CF Estrela da Amadora, CS Marítimo, FC Alverca, FC Arouca, FC Famalicão, FC Porto, GD Estoril Praia, Gil Vicente FC, Moreirense FC, Rio Ave FC, Sport Lisboa e Benfica, Sporting Clube de Braga, Sporting Clube de Portugal, Vitória SC
</details>

<details>
<summary><strong>Brasileirão</strong> (Brasil) — 20 clubes</summary>

Botafogo FR, CA Mineiro, CA Paranaense, Chapecoense AF, Clube do Remo, Coritiba FBC, CR Flamengo, CR Vasco da Gama, Cruzeiro EC, EC Bahia, EC Vitória, Fluminense FC, Grêmio FBPA, Mirassol FC, RB Bragantino, Santos FC, São Paulo FC, SC Corinthians Paulista, SC Internacional, SE Palmeiras
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
