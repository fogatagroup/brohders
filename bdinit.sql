--INIT BROHDERS

create table role
(
    roleid serial primary key,
    name text not null,
    pages text[],
    isdeleted bool not null default false,
    isactive bool not null default true
);

create table device
(
	deviceid serial primary key,
	serial text not null,
	description text,
	isactive boolean,
	isdeleted boolean
);

create table public.user 
(
    userid serial primary key,
    username text not null,
    password_hash text not null,
    roleid integer references public.role,
	deviceid integer references device,
    name text not null,
    lastname text null
);