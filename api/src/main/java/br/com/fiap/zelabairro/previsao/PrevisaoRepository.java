package br.com.fiap.zelabairro.previsao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PrevisaoRepository extends JpaRepository<Previsao, Long> {
    Optional<Previsao> findFirstByLixeiraIdOrderByDataHoraDesc(Long lixeiraId);
}
