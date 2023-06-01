-- for help \?
-- create database practice
-- list database => \l
-- connect to a new db => \c
-- 

create table Records (
  id BIGSERIAL NOT NUll PRIMARY KEY,
  name VARCHAR(50) NOT NUll,
  doc VARCHAR(100) NOT NUll
);


insert into Records (name, doc) values ('Yeah yeah', '123456')
