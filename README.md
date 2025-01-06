# Nest API Boilerplate

This project aims to provide an API project boilerplate based on [nestjs](https://nestjs.com/), which already includes or will soon include the following basic functions:

* Database
  * Migrations
* API
  * Authentication
    * Passport
      * Local strategy
      * LDAP strategy
      * JWT strategy
  * Authorization
    * Basic RBAC (Role-based access control)
  * Health check
    * orm
    * memory
    * disk
    * http
* Task Scheduling
* Testing
  * Unit testing framework
  * E2E testing framework

## Development environment preparation

### 1. Install dependencies

```shell
$ npm install
```

### 2. Environment variable configuration

There are three environment variable files pre-set in this project template, and their priority is as follows:

.env.local > .env.development > .env

If you want to modify the default environment variable priority or define a new environment variable priority, you can modify the `src/config/env.ts` file. To create an environment variable file, you can copy it from the `.env.example` file:

```shell
$ cp .env.example .env
```

You can modify the configuration as needed.

### 3. Initiate the development environment infrastructure

In order to quickly start working in the development environment, here are some services that the development environment needs to use, which will run in Docker containers.

* postgres
* [pgweb](https://github.com/sosedoff/pgweb)
* [integresql](https://github.com/allaboutapps/integresql)

Run the following command to start all the basic services mentioned above:

```shell
$ docker-compose -f docker-compose-dev-infra.yml --env-file .env up
```

### 4. Initialize the development environment database

Create a development environment database:

```shell
$ npm run db:create
```

### 5. Run database migration script

Due to the fact that the development database in the newly built development environment is brand new and has no schema, it is necessary to run the accumulated migration scripts to update the database schema:

```shell
$ npm run migration:run
```

### 6. Add data seeds to the database (optional)

This step is optional. If some data seeds have already been defined in the project, running the following script can quickly synchronize some initial data to the database:

```shell
$ npm run seed:run
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

### 1. Unit Test

Unit test files are usually placed in the same directory as functional code. In this project template, there are all files in the `src` directory that end with `.spec.ts`. Run unit tests:

```shell
$ npm run test:unit
```

### 2. E2E Test

E2E testing files are generally not placed together with functional code. In this project template, they are all files in the `test` directory that end with `.e2e-spec.ts`. Run end-to-end testing:

```shell
$ npm run test:e2e
```

### 3. All Test

Run all tests at once without distinguishing test types:

```shell
$ npm run test
```

## Migrations

### 1. Generate

When you modify the code of any database entity, specifically the classes decorated with the `@Entity()` provided by typeorm, you can run the following script to have typeorm automatically generate a database migration script:

```shell
$ npm run migration:generate
```

The generated database migration script will be placed in the `src/database/migrations/` directory.

### 2. Revert

If you want to revert the latest database migration script, you can run the following command:

```shell
$ npm run migration:revert
```

It should be noted that each time this command is run, only the most recent database migration script will be revoked. If you need to revoke multiple times, you need to run the script continuously for the corresponding number of times.

## Others

### 1. Using an interactive environment

REPL (Read Eval Print Loop) is an interactive environment that accepts single user inputs, executes them, and returns the results to the user. The REPL function allows you to directly check the dependency graph from the terminal and call methods on the provider (and controller):

```shell
$ npm run start:repl
```
