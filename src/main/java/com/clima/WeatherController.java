package com.clima;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clima.model.Cidade; //
import com.clima.model.ListaCidades; //
import com.clima.model.PrevisaoCidade; //
import com.clima.parse.XStreamParser; //
import com.clima.service.WeatherForecastService; //

@RestController
@RequestMapping("/api")
public class WeatherController {

    /**
     * NOVO ENDPOINT: /api/cities
     * Busca cidades por nome e retorna uma lista de cidades correspondentes.
     * Ex: GET /api/cities?city=Sao%20paulo
     */
    @GetMapping("/cities")
    public ResponseEntity<?> searchCities(@RequestParam String city) {
        try {
            // Chama o serviço para buscar cidades na API do CPTEC/INPE
            String cidadesXML = WeatherForecastService.cidades(city);

            // Inicializa o parser XStream
            XStreamParser<PrevisaoCidade, ListaCidades> xspCidades = new XStreamParser<>();

            // Converte o XML em um objeto ListaCidades
            ListaCidades listaCidades = xspCidades.cidades(cidadesXML);

            // Se nenhuma cidade for encontrada, retorna um status 404
            if (listaCidades.getCidades().isEmpty()) {
                return ResponseEntity.status(404).body("Cidade não encontrada: " + city);
            }

            // Retorna a lista completa de cidades para o frontend
            return ResponseEntity.ok(listaCidades);
        } catch (Exception e) {
            e.printStackTrace(); // Imprime o stack trace para depuração
            return ResponseEntity.status(500).body("Erro interno ao buscar cidades.");
        }
    }

    /**
     * ENDPOINT EXISTENTE: /api/weather
     * Modificado para receber o ID da cidade e retornar sua previsão de 7 dias.
     * Ex: GET /api/weather?cityId=244
     */
    @GetMapping("/weather")
    public ResponseEntity<?> getWeather(@RequestParam int cityId) { // Agora espera um parâmetro 'cityId' do tipo inteiro
        try {
            // Chama o serviço para buscar a previsão de 7 dias na API do CPTEC/INPE usando o ID da cidade
            String previsaoXML = WeatherForecastService.previsoesParaSeteDias(cityId);

            // Inicializa o parser XStream
            XStreamParser<PrevisaoCidade, ListaCidades> xspPrevisoes = new XStreamParser<>();

            // Converte o XML em um objeto PrevisaoCidade
            PrevisaoCidade previsao = xspPrevisoes.previsao(previsaoXML);

            // Retorna a previsão da cidade
            return ResponseEntity.ok(previsao);

        } catch (Exception e) {
            e.printStackTrace(); // Imprime o stack trace para depuração
            return ResponseEntity.status(500).body("Erro interno ao processar a solicitação.");
        }
    }
}