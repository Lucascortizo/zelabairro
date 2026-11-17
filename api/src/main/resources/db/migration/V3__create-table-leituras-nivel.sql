create table leituras_nivel(
    id bigint auto_increment,
    lixeira_id bigint not null,
    codigo_lixeira varchar(10) not null,
    distancia_cm double not null,
    nivel_percentual int not null,
    data_hora datetime not null,

    primary key (id)
);
