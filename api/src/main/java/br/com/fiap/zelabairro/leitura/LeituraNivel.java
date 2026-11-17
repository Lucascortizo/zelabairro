package br.com.fiap.zelabairro.leitura;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "LeituraNivel")
@Table(name = "leituras_nivel")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@EqualsAndHashCode(of = "id")
public class LeituraNivel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long lixeiraId;
    private String codigoLixeira;
    private Double distanciaCm;
    private Integer nivelPercentual;
    private LocalDateTime dataHora;

    public LeituraNivel(LeituraNivelDto corpo, Long lixeiraId) {
        this.lixeiraId = lixeiraId;
        this.codigoLixeira = corpo.codigoLixeira();
        this.distanciaCm = corpo.distanciaCm();
        this.nivelPercentual = corpo.nivelPercentual();
        this.dataHora = LocalDateTime.now();
    }
}
