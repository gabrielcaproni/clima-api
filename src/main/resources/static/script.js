document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const resultDiv = document.getElementById('forecastResult');

    if (!city) {
        alert('Por favor, digite o nome de uma cidade.');
        return;
    }

    resultDiv.innerHTML = '<p>Buscando...</p>';

    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Cidade não encontrada ou erro no servidor.');
                });
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
        });
});

function displayForecast(data) {
    const resultDiv = document.getElementById('forecastResult');
    resultDiv.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = `Previsão para ${data.nome} - ${data.uf}`;
    resultDiv.appendChild(title);

    // Lista dos ícones que você tem (agora com o de sol)
    const availableIcons = ['c', 'pn', 't', 'n', 'ps', 'cl'];

    data.previsoes.forEach(previsao => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        let iconName = previsao.tempo;

        // Verifica se a sigla da previsão está na sua lista de ícones
        if (!availableIcons.includes(iconName)) {
            // Se não estiver, usa o ícone 'n.png' (Encoberto) como padrão
            iconName = 'n';
        }

        const [year, month, day] = previsao.dia.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        dayCard.innerHTML = `
            <img src="/images/${iconName}.png" alt="Ícone para ${previsao.tempo}" title="Tempo: ${previsao.tempo}">
            <div class="day-info">
                <h3>${formattedDate}</h3>
                <p>Máx: <strong>${previsao.maxima}°C</strong> / Mín: <strong>${previsao.minima}°C</strong></p>
            </div>
        `;
        resultDiv.appendChild(dayCard);
    });
}