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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.zelabairro.ocorrencia.Ocorrencia;
import br.com.fiap.zelabairro.ocorrencia.OcorrenciaDto;
import br.com.fiap.zelabairro.ocorrencia.OcorrenciaRepository;
import br.com.fiap.zelabairro.ocorrencia.StatusDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ocorrencias")
@CrossOrigin
public class OcorrenciaController {
    @Autowired
    private OcorrenciaRepository repository;

    @PostMapping
    public ResponseEntity<Ocorrencia> cadastrar(@RequestBody @Valid OcorrenciaDto corpo) {
        Ocorrencia ocorrencia = new Ocorrencia(corpo);
        repository.save(ocorrencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(ocorrencia);
    }

    @GetMapping
    public Page<Ocorrencia> listar(
            @PageableDefault(size = 10, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable paginacao) {
        return repository.findAllByAtivoTrue(paginacao);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> buscar(@PathVariable Long id) {
        Optional<Ocorrencia> encontrada = repository.findByIdAndAtivoTrue(id);
        if (encontrada.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrada.get());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ocorrencia> atualizarStatus(@PathVariable Long id, @RequestBody @Valid StatusDto corpo) {
        Optional<Ocorrencia> encontrada = repository.findByIdAndAtivoTrue(id);
        if (encontrada.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Ocorrencia ocorrencia = encontrada.get();
        ocorrencia.atualizarStatus(corpo.status());
        repository.save(ocorrencia);
        return ResponseEntity.ok(ocorrencia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Ocorrencia> encontrada = repository.findByIdAndAtivoTrue(id);
        if (encontrada.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Ocorrencia ocorrencia = encontrada.get();
        ocorrencia.excluir();
        repository.save(ocorrencia);
        return ResponseEntity.noContent().build();
    }
}
