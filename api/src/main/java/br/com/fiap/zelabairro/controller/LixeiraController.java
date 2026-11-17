package br.com.fiap.zelabairro.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.zelabairro.erro.ErroDto;
import br.com.fiap.zelabairro.lixeira.Lixeira;
import br.com.fiap.zelabairro.lixeira.LixeiraDto;
import br.com.fiap.zelabairro.lixeira.LixeiraRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/lixeiras")
@CrossOrigin
public class LixeiraController {
    @Autowired
    private LixeiraRepository repository;

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody @Valid LixeiraDto corpo) {
        // Confere todas as lixeiras, inclusive as excluídas, porque o banco não aceita código repetido
        if (repository.existsByCodigo(corpo.codigo())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErroDto("Já existe uma lixeira com o código " + corpo.codigo() + "."));
        }
        Lixeira lixeira = new Lixeira(corpo);
        repository.save(lixeira);
        return ResponseEntity.status(HttpStatus.CREATED).body(lixeira);
    }

    @GetMapping
    public Page<Lixeira> listar(@PageableDefault(size = 10, sort = "codigo") Pageable paginacao) {
        return repository.findAllByAtivoTrue(paginacao);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lixeira> buscar(@PathVariable Long id) {
        Optional<Lixeira> encontrada = repository.findByIdAndAtivoTrue(id);
        if (encontrada.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrada.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody @Valid LixeiraDto corpo) {
        Optional<Lixeira> encontrada = repository.findByIdAndAtivoTrue(id);
        if (encontrada.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (repository.existsByCodigoAndIdNot(corpo.codigo(), id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErroDto("Já existe outra lixeira com o código " + corpo.codigo() + "."));
        }
        Lixeira lixeira = encontrada.get();
        lixeira.atualizarInformacoes(corpo);
        repository.save(lixeira);
        return ResponseEntity.ok(lixeira);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Lixeira> encontrada = repository.findByIdAndAtivoTrue(id);
        if (encontrada.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Lixeira lixeira = encontrada.get();
        lixeira.excluir();
        repository.save(lixeira);
        return ResponseEntity.noContent().build();
    }
}
