package br.com.fiap.zelabairro.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.zelabairro.erro.ErroDto;
import br.com.fiap.zelabairro.lixeira.LixeiraRepository;
import br.com.fiap.zelabairro.previsao.Previsao;
import br.com.fiap.zelabairro.previsao.PrevisaoDto;
import br.com.fiap.zelabairro.previsao.PrevisaoRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/previsoes")
@CrossOrigin
public class PrevisaoController {
    @Autowired
    private PrevisaoRepository repository;

    @Autowired
    private LixeiraRepository lixeiraRepository;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody @Valid PrevisaoDto corpo) {
        if (lixeiraRepository.findByIdAndAtivoTrue(corpo.lixeiraId()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErroDto("Lixeira " + corpo.lixeiraId() + " não encontrada."));
        }
        Previsao previsao = new Previsao(corpo);
        repository.save(previsao);
        return ResponseEntity.status(HttpStatus.CREATED).body(previsao);
    }

    @GetMapping
    public ResponseEntity<?> buscarMaisRecente(@RequestParam Long lixeiraId) {
        Optional<Previsao> encontrada = repository.findFirstByLixeiraIdOrderByDataHoraDesc(lixeiraId);
        if (encontrada.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErroDto("Nenhuma previsão para a lixeira " + lixeiraId + "."));
        }
        return ResponseEntity.ok(encontrada.get());
    }
}
