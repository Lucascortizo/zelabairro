create table previsoes(
    id bigint auto_increment,
    lixeira_id bigint not null,
    transborda_em24h boolean not null,
    probabilidade double not null,
    data_hora datetime not null,

    primary key (id)
);
