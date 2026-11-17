package br.com.fiap.zelabairro.previsao;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record PrevisaoDto(
        @NotNull Long lixeiraId,
        @NotNull Boolean transbordaEm24h,
        @NotNull @DecimalMin("0.0") @DecimalMax("1.0") Double probabilidade) {
}
