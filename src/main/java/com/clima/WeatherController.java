package com.clima;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clima.model.Cidade;
import com.clima.model.ListaCidades;
import com.clima.model.PrevisaoCidade;
import com.clima.parse.XStreamParser;
import com.clima.service.WeatherForecastService;

@RestController
@RequestMapping("/api")
public class WeatherController {

    @GetMapping("/weather")
    public ResponseEntity<?> getWeather(@RequestParam String city) {
        try {
            String cidadesXML = WeatherForecastService.cidades(city);
            XStreamParser<PrevisaoCidade, ListaCidades> xspCidades = new XStreamParser<>();
            ListaCidades listaCidades = xspCidades.cidades(cidadesXML);

            if (listaCidades.getCidades().isEmpty()) {
                return ResponseEntity.status(404).body("Cidade não encontrada: " + city);
            }

            Cidade cidade = listaCidades.getCidades().get(0);

            String previsaoXML = WeatherForecastService.previsoesParaSeteDias(cidade.getId());
            XStreamParser<PrevisaoCidade, ListaCidades> xspPrevisoes = new XStreamParser<>();
            PrevisaoCidade previsao = xspPrevisoes.previsao(previsaoXML);

            return ResponseEntity.ok(previsao);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno ao processar a solicitação.");
        }
    }
}