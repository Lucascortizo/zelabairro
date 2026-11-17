package br.com.fiap.zelabairro.leitura;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record LeituraNivelDto(
        @NotBlank String codigoLixeira,
        @NotNull @PositiveOrZero Double distanciaCm,
        @NotNull @Min(0) @Max(100) Integer nivelPercentual) {
}
