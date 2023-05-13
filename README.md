<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ npm install
```

## MySQL - Docker

```bash
# creat container
$ docker run -it --name mysql -p 3306:3306 -v test-mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=qwerty -d mysql

# access the container
$ docker exec -it mysql bash

# create a new user with permissions - optional
$ CREATE USER 'martin'@'*' IDENTIFIED BY 'qwerty';
	GRANT ALL PRIVILEGES ON *.* TO 'martin'@'*' WITH GRANT OPTION;
	flush privileges;
  exit

# create database
$ mysql> CREATE DATABASE app;

```

## Create and update tables

```bash
# at the root of the project
$ npm run migrate:up
```

## Import Postman

```bash
# import collection
app-nest.postman_collection.json

# import environment
app-nest.postman_environment.json
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
