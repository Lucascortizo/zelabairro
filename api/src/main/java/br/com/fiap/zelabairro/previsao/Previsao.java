package br.com.fiap.zelabairro.previsao;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "Previsao")
@Table(name = "previsoes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@EqualsAndHashCode(of = "id")
public class Previsao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long lixeiraId;
    private Boolean transbordaEm24h;
    private Double probabilidade;
    private LocalDateTime dataHora;

    public Previsao(PrevisaoDto corpo) {
        this.lixeiraId = corpo.lixeiraId();
        this.transbordaEm24h = corpo.transbordaEm24h();
        this.probabilidade = corpo.probabilidade();
        this.dataHora = LocalDateTime.now();
    }
}
