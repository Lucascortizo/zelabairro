package br.com.fiap.zelabairro.ocorrencia;

import jakarta.validation.constraints.NotNull;

public record StatusDto(@NotNull StatusOcorrencia status) {
}
