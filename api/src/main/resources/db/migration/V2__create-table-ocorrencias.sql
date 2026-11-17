create table ocorrencias(
    id bigint auto_increment,
    tipo varchar(20) not null,
    descricao varchar(500) not null,
    foto_base64 mediumtext,
    autor_nome varchar(100) not null,
    status varchar(20) not null,
    data_abertura datetime not null,
    data_resolucao datetime,
    ativo boolean not null,
    logradouro varchar(100) not null,
    numero varchar(10),
    bairro varchar(100) not null,
    cidade varchar(100) not null,
    uf varchar(2) not null,
    cep varchar(9) not null,

    primary key (id)
);
