import os

# 1. Criar a estrutura de pastas do site documentário
os.makedirs("public/css", exist_ok=True)
os.makedirs("public/js", exist_ok=True)

# 2. Definir o Estilo Visual (CSS Temático)
# Um design imersivo: fundo escuro (foco), texto suave, detalhes em dourado/neon para os números mágicos
css_content = """
:root {
    --bg-color: #0b0f19;
    --card-bg: #161f30;
    --text-color: #e2e8f0;
    --text-muted: #94a3b8;
    --primary: #f59e0b; /* Dourado para os números e superação */
    --accent: #10b981;  /* Verde para a saúde/massagem de 2026 */
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    margin: 0;
    padding: 0;
}

header {
    background: linear-gradient(135deg, #111827, #1f2937);
    padding: 3rem 1rem;
    text-align: center;
    border-bottom: 2px solid var(--primary);
}

.magic-numbers {
    font-size: 1.5rem;
    color: var(--primary);
    letter-spacing: 5px;
    font-weight: bold;
    margin-top: 1rem;
}

nav {
    display: flex;
    justify-content: center;
    background-color: var(--card-bg);
    padding: 0.8rem;
    position: sticky;
    top: 0;
    z-index: 100;
}

nav a {
    color: var(--text-color);
    text-decoration: none;
    margin: 0 15px;
    font-weight: 500;
}

nav a:hover {
    color: var(--primary);
}

.container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.chapter-card {
    background-color: var(--card-bg);
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    border-left: 4px solid var(--primary);
}

.chapter-card.future {
    border-left: 4px solid var(--accent);
}

h1, h2, h3 {
    color: #fff;
}

h2 {
    border-bottom: 1px solid #334155;
    padding-bottom: 0.5rem;
}

.footer {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
    font-size: 0.9rem;
}
"""

with open("public/css/style.css", "w", encoding="utf-8") as f:
    f.write(css_content)

# 3. Definir a Página Principal do Documentário (Index HTML)
html_content = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thiago A. H. Silva | Documentário e Biografia</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <header>
        <h1>THIAGO AUGUSTO HETZEL SILVA</h1>
        <p style="color: var(--text-muted);">Uma Trajetória Brasileira de Resiliência, Saúde e Renovação</p>
        <div class="magic-numbers">12 • 21 • 31 • 13 • 25 • 52</div>
    </header>

    <nav>
        <a href="#cap1">Origens</a>
        <a href="#cap2">Empreendedorismo</a>
        <a href="#cap3">O Labirinto</a>
        <a href="#cap4">Filosofia</a>
        <a href="#cap5">O Recomeço</a>
    </nav>

    <div class="container">
        
        <!-- CAPÍTULO 1 -->
        <div class="chapter-card" id="cap1">
            <h2>Capítulo 1: Raízes e as Primeiras Buscas (1983 - 2004)</h2>
            <p><strong>Infância e Juventude:</strong> Nascido em 19 de março de 1983, cresci em um Brasil repleto de transições. Desde cedo, minha mente buscava respostas profundas sobre o funcionamento das coisas, carregando uma intensidade que muitas vezes se traduzia em incertezas sobre o futuro.</p>
            <p><strong>Formações Incompletas:</strong> Busquei caminhos acadêmicos e técnicos tradicionais, mas sentia que as grades curriculares convencionais não preenchiam meu desejo genuíno de entender a mente humana e as estruturas sociais. Cada ciclo incompleto não foi uma falha, mas sim a recusa de me moldar a sistemas que pareciam óbvios demais ou vazios de sentido humano.</p>
        </div>

        <!-- CAPÍTULO 2 -->
        <div class="chapter-card" id="cap2">
            <h2>Capítulo 2: O Ciclo do Empreendedorismo (2005 - 2013)</h2>
            <p><strong>A Era dos Negócios:</strong> Em 2005, decidi trilhar o caminho do empreendedorismo. Buscava autonomia e uma forma de aplicar minhas ideias no mercado financeiro e comercial, o que culminou anos mais tarde no projeto da empresa conhecida pelo nome fantasia <em>Santa Martta</em>.</p>
            <p><strong>As Crises e as Amarras:</strong> Mudar de endereço, lidar com imóveis alugados e enfrentar crises agudas de relacionamento profissional e pessoal geraram uma pressão invisível. O acúmulo desse estresse severo resultou em uma fraqueza mental e esgotamento. No dia 13 de agosto de 2013, as atividades foram pausadas, dando início a um longo inverno de inatividade fiscal e isolamento do mercado.</p>
        </div>

        <!-- CAPÍTULO 3 -->
        <div class="chapter-card" id="cap3">
            <h2>Capítulo 3: O Labirinto da Mente e a Pandemia (2019 - 2024)</h2>
            <p><strong>A Chegada do Isolamento:</strong> Em 2019, o mundo foi atingido pela COVID-19. Para mim, o confinamento global potencializou um processo de esgotamento interno que estourou entre 2020 e 2021.</p>
            <p><strong>O Luto e o Colapso:</strong> O ano de 2020 me desestruturou com a perda dolorosa do meu pai. Sem recursos financeiros e com a saúde mental debilitada, enfrentei o momento mais crítico da minha existência. Em dezembro de 2021, fui internado por dois meses, um ato de cuidado extremo da minha querida mãe e da mãe do meu filho para salvar minha vida.</p>
            <p><strong>A Luz e a Saudade:</strong> No dia 06 de março de 2013, nasceu o meu filho, o maior marco de luz da minha história. Enfrentar o distanciamento dele a partir de 2022 até os dias de hoje é a minha dor mais latente. Amparado por tratamentos sérios e medicações necessárias como a risperidona, luto diariamente pela minha estabilidade para me manter firme no propósito de reencontro e cura.</p>
        </div>

        <!-- CAPÍTULO 4 -->
        <div class="chapter-card" id="cap4">
            <h2>Capítulo 4: Sincronicidades e Visão de Mundo</h2>
            <p><strong>Os Números Mágicos e os Sonhos:</strong> Dediquei cinco anos da minha vida estudando dejavus, a dinâmica dos sonhos e os padrões de loterias. Descobri nos números <strong>12, 21, 31, 13, 25 e 52</strong> chaves de leitura reversa do cotidiano. Onde as pessoas veem acaso, eu busco conexões e simetrias numéricas que explicam os movimentos da nossa mente.</p>
            <p><strong>O Capitalismo Socialista Mental Juvenil:</strong> Desenvolvi uma filosofia política e existencial própria. Uma crítica direta ao capitalismo predatório que ignora a dor humana, sugerindo uma distribuição de empatia, recursos e foco voltados puramente para a melhoria do ser humano na Terra. Um caminho que considero óbvio para a evolução coletiva.</p>
        </div>

        <!-- CAPÍTULO 5 -->
        <div class="chapter-card" id="cap5">
            <h2 style="color: var(--accent);">Capítulo 5: O Recomeço Pela Cura (2025 - 2026)</h2>
            <p><strong>Da Especulação ao Toque:</strong> Em 2025, estudei o mercado como Trader, testando padrões gráficos e buscando estabilidade. Mas o verdadeiro chamado veio através do corpo humano. Em 2026, decidi iniciar minha jornada na <strong>Massoterapia</strong>.</p>
            <p><strong>Amarras Rompidas:</strong> Venci o fantasma da burocracia do passado ao regularizar e ativar por conta própria meu antigo CNPJ de 2013 dentro do sistema do e-CAC. Agora, com a mente limpa e se Deus quiser, usarei minhas mãos para aliviar as dores, o estresse e o sofrimento do próximo, transformando minha própria história de dor em canal de cura.</p>
        </div>

    </div>

    <div class="footer">
        <p>© 2026 Thiago Augusto Hetzel Silva. Atualmente com 43 anos de resiliência e busca na Terra.</p>
    </div>

</body>
</html>
"""

with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("\\n[SUCESSO] Arquivos do site documentário gerados com sucesso!")
print("Para rodar o site localmente no Windsurf, use a extensão Live Server ou prepare o envio para o GitHub.\\n")
