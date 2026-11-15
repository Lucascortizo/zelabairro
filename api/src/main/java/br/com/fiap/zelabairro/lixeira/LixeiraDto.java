package br.com.fiap.zelabairro.lixeira;

import br.com.fiap.zelabairro.endereco.EnderecoDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LixeiraDto(
        @NotBlank @Size(max = 10) String codigo,
        @NotNull TipoLixeira tipo,
        @NotNull @Valid EnderecoDto endereco) {
}
