create table lixeiras(
    id bigint auto_increment,
    codigo varchar(10) not null unique,
    tipo varchar(20) not null,
    nivel_atual int not null,
    ativo boolean not null,
    logradouro varchar(100) not null,
    numero varchar(10),
    bairro varchar(100) not null,
    cidade varchar(100) not null,
    uf varchar(2) not null,
    cep varchar(9) not null,

    primary key (id)
);