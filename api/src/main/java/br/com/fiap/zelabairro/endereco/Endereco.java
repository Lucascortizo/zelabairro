package br.com.fiap.zelabairro.endereco;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Endereco {
    private String logradouro;
    private String numero;
    private String bairro;
    private String cidade;
    private String uf;
    private String cep;

    public Endereco(EnderecoDto corpo) {
        this.logradouro = corpo.logradouro();
        this.numero = corpo.numero();
        this.bairro = corpo.bairro();
        this.cidade = corpo.cidade();
        this.uf = corpo.uf();
        this.cep = corpo.cep();
    }
}
