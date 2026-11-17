package br.com.fiap.zelabairro.ocorrencia;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
    Page<Ocorrencia> findAllByAtivoTrue(Pageable paginacao);

    Optional<Ocorrencia> findByIdAndAtivoTrue(Long id);
}
