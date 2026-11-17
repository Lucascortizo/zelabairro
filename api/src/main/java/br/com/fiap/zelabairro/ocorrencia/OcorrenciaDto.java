package br.com.fiap.zelabairro.ocorrencia;

import br.com.fiap.zelabairro.endereco.EnderecoDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OcorrenciaDto(
        @NotNull TipoOcorrencia tipo,
        @NotBlank @Size(max = 500) String descricao,
        // Limite da foto: 1.500.000 caracteres em base64, cerca de 1,1 MB de imagem
        @Size(max = 1500000) String fotoBase64,
        @NotBlank @Size(max = 100) String autorNome,
        @NotNull @Valid EnderecoDto endereco) {
}
