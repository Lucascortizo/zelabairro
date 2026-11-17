package br.com.fiap.zelabairro.ocorrencia;

import java.time.LocalDateTime;

import br.com.fiap.zelabairro.endereco.Endereco;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "Ocorrencia")
@Table(name = "ocorrencias")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@EqualsAndHashCode(of = "id")
public class Ocorrencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoOcorrencia tipo;

    private String descricao;
    private String fotoBase64;
    private String autorNome;

    @Enumerated(EnumType.STRING)
    private StatusOcorrencia status;

    private LocalDateTime dataAbertura;
    private LocalDateTime dataResolucao;
    private Boolean ativo;

    @Embedded
    private Endereco endereco;

    public Ocorrencia(OcorrenciaDto corpo) {
        this.tipo = corpo.tipo();
        this.descricao = corpo.descricao();
        this.fotoBase64 = corpo.fotoBase64();
        this.autorNome = corpo.autorNome();
        this.endereco = new Endereco(corpo.endereco());
        this.status = StatusOcorrencia.ABERTA;
        this.dataAbertura = LocalDateTime.now();
        this.ativo = true;
    }

    public void atualizarStatus(StatusOcorrencia novoStatus) {
        this.status = novoStatus;
        if (novoStatus == StatusOcorrencia.RESOLVIDA) {
            // Só grava a data na primeira vez que for resolvida
            if (this.dataResolucao == null) {
                this.dataResolucao = LocalDateTime.now();
            }
        } else {
            // Se a ocorrência for reaberta, ela deixa de estar resolvida
            this.dataResolucao = null;
        }
    }

    public void excluir() {
        this.ativo = false;
    }
}
