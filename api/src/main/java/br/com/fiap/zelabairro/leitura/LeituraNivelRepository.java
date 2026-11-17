package br.com.fiap.zelabairro.leitura;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeituraNivelRepository extends JpaRepository<LeituraNivel, Long> {
    Page<LeituraNivel> findAllByLixeiraId(Long lixeiraId, Pageable paginacao);
}
