package br.com.fiap.zelabairro.lixeira;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LixeiraRepository extends JpaRepository<Lixeira, Long> {
    Page<Lixeira> findAllByAtivoTrue(Pageable paginacao);

    Optional<Lixeira> findByIdAndAtivoTrue(Long id);

    Optional<Lixeira> findByCodigoAndAtivoTrue(String codigo);

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);
}
