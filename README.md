# Clima API 🌤️

## Descrição

**Clima API** é uma aplicação web de previsão do tempo que consome os dados da API pública do [CPTEC/INPE](http://servicos.cptec.inpe.br/). O projeto consiste em um backend construído com **Java** e **Spring Boot** que busca e processa os dados de previsão, e um frontend simples e intuitivo feito com **HTML, CSS e JavaScript** para exibir as informações ao usuário.

A aplicação permite que o usuário busque por uma cidade e veja a previsão do tempo para os próximos 7 dias, incluindo temperaturas máxima e mínima, e um ícone representativo para a condição do tempo.

## ✨ Funcionalidades

  - **Busca de Cidades:** Permite ao usuário buscar por qualquer cidade do Brasil.
  - **Seleção de Cidades:** Caso a busca retorne múltiplas cidades com o mesmo nome, a interface exibe uma lista para que o usuário selecione a correta.
  - **Previsão para 7 Dias:** Exibe a previsão do tempo detalhada para a semana inteira na cidade selecionada.
  - **Interface Clara:** Apresenta as informações de forma organizada, com ícones que representam as condições climáticas (sol, chuva, nublado, etc.).

## 🚀 Tecnologias Utilizadas

### Backend

  - **Java 17**
  - **Spring Boot**
  - **Maven**
  - **XStream** (para parsing de XML)

### Frontend

  - **HTML5**
  - **CSS3**
  - **JavaScript (ES6+)**

### API Externa

  - **API de Previsão do Tempo do CPTEC/INPE**

## 🤝 Colaboração

Este projeto foi desenvolvido por `guilhermehenrsilva` & `gabrielcaproni` em colaboração.

## 🛠️ Como Executar o Projeto

Para executar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/clima-api.git
    cd clima-api
    ```

2.  **Execute a aplicação com o Maven:**
    É necessário ter o Java e o Maven instalados em sua máquina.

    ```bash
    mvn spring-boot:run
    ```

3.  **Acesse no navegador:**
    Após iniciar o servidor, a aplicação estará disponível em:
    [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)

## 🔧 Endpoints da API

A aplicação expõe dois endpoints principais para o frontend:

  - `GET /api/cities?city={nome_da_cidade}`

      - Busca e retorna uma lista de cidades que correspondem ao nome fornecido.
      - **Exemplo:** `/api/cities?city=Sao%20paulo`

  - `GET /api/weather?cityId={id_da_cidade}`

      - Retorna a previsão do tempo para os próximos 7 dias com base no ID da cidade.
      - **Exemplo:** `/api/weather?cityId=244`

-----
