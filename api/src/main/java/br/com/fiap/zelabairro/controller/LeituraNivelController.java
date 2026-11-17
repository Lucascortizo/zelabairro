package br.com.fiap.zelabairro.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
import br.com.fiap.zelabairro.leitura.LeituraNivel;
import br.com.fiap.zelabairro.leitura.LeituraNivelDto;
import br.com.fiap.zelabairro.leitura.LeituraNivelRepository;
import br.com.fiap.zelabairro.lixeira.Lixeira;
import br.com.fiap.zelabairro.lixeira.LixeiraRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/leituras")
@CrossOrigin
public class LeituraNivelController {
    @Autowired
    private LeituraNivelRepository repository;

    @Autowired
    private LixeiraRepository lixeiraRepository;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody @Valid LeituraNivelDto corpo) {
        Optional<Lixeira> encontrada = lixeiraRepository.findByCodigoAndAtivoTrue(corpo.codigoLixeira());
        if (encontrada.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErroDto("Lixeira " + corpo.codigoLixeira() + " não encontrada."));
        }
        Lixeira lixeira = encontrada.get();

        LeituraNivel leitura = new LeituraNivel(corpo, lixeira.getId());
        repository.save(leitura);

        lixeira.atualizarNivel(corpo.nivelPercentual());
        lixeiraRepository.save(lixeira);

        return ResponseEntity.status(HttpStatus.CREATED).body(leitura);
    }

    @GetMapping
    public Page<LeituraNivel> listar(@RequestParam Long lixeiraId,
            @PageableDefault(size = 10, sort = "dataHora", direction = Sort.Direction.DESC) Pageable paginacao) {
        return repository.findAllByLixeiraId(lixeiraId, paginacao);
    }
}
