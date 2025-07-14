document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const resultDiv = document.getElementById('forecastResult'); //
    const citySelectionDiv = document.getElementById('citySelection'); // Referência ao novo div de seleção

    if (!city) {
        alert('Por favor, digite o nome de uma cidade.');
        return;
    }

    resultDiv.innerHTML = '<p>Buscando cidades...</p>'; // Mensagem de busca inicial
    citySelectionDiv.innerHTML = ''; // Limpa seleções de cidades anteriores

    // PRIMEIRA CHAMADA: Buscar lista de cidades pelo nome usando o NOVO ENDPOINT /api/cities
    fetch(`/api/cities?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                // Se a resposta não for OK (ex: 404 Not Found do backend), lança um erro
                return response.text().then(text => {
                    throw new Error(text || 'Erro ao buscar cidades.');
                });
            }
            return response.json(); // Retorna o JSON (ListaCidades)
        })
        .then(data => {
            // Verifica se a API retornou uma lista de cidades válida
            if (data && data.cidades && data.cidades.length > 0) { //
                // Se houver múltiplas cidades, exibe para o usuário escolher
                if (data.cidades.length > 1) {
                    resultDiv.innerHTML = '<p>Múltiplas cidades encontradas. Por favor, selecione uma:</p>';
                    const ul = document.createElement('ul');
                    ul.style.listStyle = 'none'; // Remove marcadores de lista
                    ul.style.padding = '0';
                    ul.style.margin = '15px 0';
                    ul.style.maxHeight = '200px'; // Limita a altura para rolagem
                    ul.style.overflowY = 'auto'; // Adiciona rolagem vertical
                    
                    data.cidades.forEach(cidade => { // Itera sobre a lista de cidades
                        const li = document.createElement('li');
                        li.className = 'city-option'; // Classe para estilização via CSS
                        li.innerHTML = `<span>${cidade.nome} - ${cidade.uf}</span>`; // Exibe nome e UF
                        
                        // Estilos inline básicos, idealmente movidos para style.css
                        li.style.cursor = 'pointer';
                        li.style.padding = '10px';
                        li.style.border = '1px solid #ccc';
                        li.style.marginBottom = '5px';
                        li.style.borderRadius = '5px';
                        li.style.backgroundColor = '#f0f0f0';
                        li.style.textAlign = 'left';
                        li.style.transition = 'background-color 0.2s';

                        li.onmouseover = () => li.style.backgroundColor = '#e0e0e0';
                        li.onmouseout = () => li.style.backgroundColor = '#f0f0f0';

                        // Ao clicar na opção, chama a função para buscar a previsão pelo ID da cidade
                        li.addEventListener('click', () => {
                            fetchForecast(cidade.id); //
                            citySelectionDiv.innerHTML = ''; // Limpa as opções de seleção após a escolha
                        });
                        ul.appendChild(li);
                    });
                    citySelectionDiv.appendChild(ul); // Adiciona a lista de opções ao div de seleção
                } else {
                    // Se apenas uma cidade for encontrada, busca a previsão diretamente usando seu ID
                    fetchForecast(data.cidades[0].id); //
                }
            } else {
                resultDiv.innerHTML = '<p class="error">Cidade não encontrada.</p>'; // Nenhuma cidade encontrada
            }
        })
        .catch(error => {
            console.error('Erro ao buscar cidades:', error);
            resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
            citySelectionDiv.innerHTML = ''; // Limpa seleções em caso de erro
        });
});

/**
 * NOVA FUNÇÃO: fetchForecast(cityId)
 * Esta função é responsável por fazer a segunda chamada ao backend para obter a previsão
 * de uma cidade, utilizando o ID da cidade selecionada ou única encontrada.
 */
function fetchForecast(cityId) {
    const resultDiv = document.getElementById('forecastResult');
    resultDiv.innerHTML = '<p>Obtendo previsão...</p>'; // Mensagem de carregamento da previsão

    // SEGUNDA CHAMADA: Buscar a previsão usando o endpoint /api/weather com o ID da cidade
    fetch(`/api/weather?cityId=${cityId}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Erro ao obter previsão.');
                });
            }
            return response.json(); // Retorna o JSON (PrevisaoCidade)
        })
        .then(data => {
            displayForecast(data); // Chama a função existente para exibir a previsão
        })
        .catch(error => {
            console.error('Erro ao obter previsão:', error);
            resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
        });
}

/**
 * Função displayForecast: Agora com o mapeamento para ícones unificados.
 */
function displayForecast(data) {
    const resultDiv = document.getElementById('forecastResult'); //
    resultDiv.innerHTML = ''; // Limpa o conteúdo anterior

    // Cria o título da previsão (Nome da Cidade - UF)
    const title = document.createElement('h2');
    title.textContent = `Previsão para ${data.nome} - ${data.uf}`; //
    resultDiv.appendChild(title); //

    // NOVO: Mapa para unificar as siglas da API aos nomes dos seus ícones de categoria
    const weatherIconMap = {
        'c': 'chuva',      // Chuva
        'ec': 'chuva',     // Encoberto com Chuvas Isoladas
        'ci': 'chuva',     // Chuvas Isoladas
        'pp': 'chuva',     // Poss. de Pancadas de Chuva
        'cm': 'chuva',     // Chuva pela Manhã
        'cn': 'chuva',     // Chuva a Noite
        'pt': 'chuva',     // Pancadas de Chuva a Tarde
        'pm': 'chuva',     // Pancadas de Chuva pela Manhã
        'np': 'chuva',     // Nublado e Pancadas de Chuva
        'pc': 'chuva',     // Pancadas de Chuva
        'cv': 'chuva',     // Chuvisco
        'ch': 'chuva',     // Chuvoso
        'pnt': 'chuva',    // Pancadas de Chuva a Noite
        'psc': 'chuva',    // Possibilidade de Chuva
        'pcm': 'chuva',    // Possibilidade de Chuva pela Manhã
        'pct': 'chuva',    // Possibilidade de Chuva a Tarde
        'pcn': 'chuva',    // Possibilidade de Chuva a Noite
        'npt': 'chuva',    // Nublado com Pancadas a Tarde
        'npn': 'chuva',    // Nublado com Pancadas a Noite
        'ncn': 'chuva',    // Nublado com Poss. de Chuva a Noite
        'nct': 'chuva',    // Nublado com Poss. de Chuva a Tarde
        'ncm': 'chuva',    // Nubl. c/ Poss. de Chuva pela Manhã
        'npm': 'chuva',    // Nublado com Pancadas pela Manhã
        'npp': 'chuva',    // Nublado com Possibilidade de Chuva
        'ct': 'chuva',     // Chuva a Tarde
        'ppn': 'chuva',    // Poss. de Panc. de Chuva a Noite
        'ppt': 'chuva',    // Poss. de Panc. de Chuva a Tarde
        'ppm': 'chuva',    // Poss. de Panc. de Chuva pela Manhã

        't': 'tempestade', // Tempestade

        'ps': 'sol',       // Predomínio de Sol
        'cl': 'sol',       // Céu Claro

        'in': 'nublado',   // Instável
        'pn': 'nublado',   // Parcialmente Nublado
        'en': 'nublado',   // Encoberto
        'n': 'nublado',    // Nublado
        'vn': 'nublado',   // Variação de Nebulosidade
        'nd': 'nublado',   // Não Definido (usando nublado como padrão para indefinidos)

        'nv': 'nevoeiro',  // Nevoeiro
        'g': 'geada',      // Geada
        'ne': 'neve'       // Neve
    };

    data.previsoes.forEach(previsao => { //
        const dayCard = document.createElement('div'); //
        dayCard.className = 'day-card'; //

        // Alterado: Obtenha o nome do ícone unificado do mapa, ou 'nublado' como padrão se a sigla não for mapeada
        let iconName = weatherIconMap[previsao.tempo] || 'nublado'; //

        const [year, month, day] = previsao.dia.split('-'); //
        const formattedDate = `${day}/${month}/${year}`; //

        // Popula o card do dia com informações e o ícone
        dayCard.innerHTML = `
            <img src="/images/${iconName}.png" alt="Ícone para ${previsao.tempo}" title="Tempo: ${previsao.tempo}">
            <div class="day-info">
                <h3>${formattedDate}</h3>
                <p>Máx: <strong>${previsao.maxima}°C</strong> / Mín: <strong>${previsao.minima}°C</strong></p>
            </div>
        `; //
        resultDiv.appendChild(dayCard); // Adiciona o card ao container de resultados
    });
}