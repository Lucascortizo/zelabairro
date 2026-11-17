package br.com.fiap.zelabairro.lixeira;

import br.com.fiap.zelabairro.endereco.Endereco;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "Lixeira")
@Table(name = "lixeiras")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@EqualsAndHashCode(of = "id")
public class Lixeira {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codigo;

    @Enumerated(EnumType.STRING)
    private TipoLixeira tipo;

    private Integer nivelAtual;
    private Boolean ativo;

    @Embedded
    private Endereco endereco;

    public Lixeira(LixeiraDto corpo) {
        this.codigo = corpo.codigo();
        this.tipo = corpo.tipo();
        this.endereco = new Endereco(corpo.endereco());
        this.nivelAtual = 0;
        this.ativo = true;
    }

    public void atualizarInformacoes(LixeiraDto corpo) {
        this.codigo = corpo.codigo();
        this.tipo = corpo.tipo();
        this.endereco.atualizarInformacoes(corpo.endereco());
    }

    public void atualizarNivel(Integer nivelPercentual) {
        this.nivelAtual = nivelPercentual;
    }

    public void excluir() {
        this.ativo = false;
    }
}
