package br.com.fiap.zelabairro.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoDto(
        @NotBlank String logradouro,
        String numero,
        @NotBlank String bairro,
        @NotBlank String cidade,
        @NotBlank @Size(min = 2, max = 2) String uf,
        @NotBlank @Pattern(regexp = "\\d{5}-?\\d{3}") String cep) {
}
