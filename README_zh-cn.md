# Nest API Boilerplate

[English](./README.md) | [简体中文](./README_zh-cn.md)

本项目旨在提供一个以 [nestjs](https://nestjs.com/) 为基础的 API 工程模版，它已经包含或即将包含如下基本功能：

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
    * Claims-based authorization (TBD)
  * Pagination and filtering
  * Health check
    * orm
    * memory
    * disk
  * Rate limiting
  * Caching
* Task Scheduling
* Testing
  * Unit testing framework
  * E2E testing framework

## 开发环境准备

### 1. 安装依赖

```shell
$ npm install
```

### 2. 环境变量配置

项目在启动时将加载项目根目录下的 `.env.${APP_ENV}` 文件作为环境变量文件，`APP_ENV` 是环境变量。如果未设置 `APP_ENV`，将默认加载项目根目录下的 `.env` 文件作为环境变量文件。例如，当 APP_ENV=production 时，项目将加载 `.env.production` 环境变量文件。

要创建环境变量文件，可以从 `.env.example`文件复制得来：

```shell
$ cp .env.example .env
```

你可以根据需要修改配置。

### 3. 启动开发环境基础设施

为了能快速在开发环境下开始工作，这里提供了一些开发环境需要用到的服务，它们将运行在 docker 容器中。

* postgres
* [pgweb](https://github.com/sosedoff/pgweb)
* [integresql](https://github.com/allaboutapps/integresql)

运行以下命令启动上述所有基础服务：

```shell
$ docker compose -f docker-compose-dev-infra.yml --env-file .env up
```

### 4. 初始化开发环境数据库

创建开发环境数据库：

```shell
$ npm run db:create
```

### 5. 运行数据库迁移脚本

由于新搭建的开发环境中的开发数据库是全新的，没有任何模式，因此需要运行积累的迁移脚本来更新数据库模式：

```shell
$ npm run migration:run
```

### 6. 为数据库添加数据种子（可选）

这个步骤是可选的。如果项目中已经定义了一些数据种子，运行如下脚本可以快速将一些初始数据同步到数据库中：

```shell
$ npm run seed:run
```

数据种子一般放置在 `modules/*/testing/*.seeder.ts` 文件中。

## 编译并运行项目

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 运行测试

### 1. 单元测试

单元测试文件一般和功能代码放在同一个目录下。在本项目模版中是 `src` 目录下的所有以 `.spec.ts` 结尾的文件。 运行单元测试：

```shell
$ npm run test:unit
```

### 2. 端到端测试

端到端测试文件一般不和功能代码放在一起，在本项目模版中是 `test` 目录下的所有以 `.e2e-spec.ts` 结尾的文件。 运行端到端测试：

```shell
$ npm run test:e2e
```

### 3. 所有测试

不区分测试类型，一次性运行所有测试：

```shell
$ npm run test
```

端到端测试依赖 PostgreSQL 和 IntegreSQL。本地运行前，请先启动开发基础设施：

```shell
$ docker compose -f docker-compose-dev-infra.yml --env-file .env up
```

## 生产就绪说明

本模版默认采用 JWT-first 的 API 认证模型，不默认挂载服务端 session 中间件。
Token 只从 `Authorization: Bearer` 请求头读取。

投入生产前，请确认：

* 设置 `NODE_ENV=production`。
* 使用至少 32 位的随机 `APP_SECRET`。
* 明确配置 `ALLOWED_ORIGINS`；生产环境校验不允许隐式使用通配 CORS。
* 除非部署在私有网络内，否则保持 `API_DOCS_ENABLED=false`。
* 配置数据库连接池变量：
  * `DATABASE_POOL_MAX`
  * `DATABASE_POOL_IDLE_TIMEOUT_MS`
  * `DATABASE_POOL_CONNECTION_TIMEOUT_MS`
* 通过 `DATABASE_SSL_MODE` 配置数据库 SSL；当使用 `verify-ca` 或 `verify-full` 时，需要同时配置 `DATABASE_SSL_CA`。
* 在服务接收流量前先运行数据库迁移。
* 使用 `/health/live` 作为 liveness probe，使用 `/health/ready` 作为 readiness probe。

## CI

GitHub Actions 定义在 `.github/workflows/ci.yml`。可复用的 CI 命令放在
`ci/` 目录下：

```shell
$ bash ci/validate.sh
$ bash ci/test-e2e.sh
```

CI 会启动 PostgreSQL 和 IntegreSQL 服务，然后运行构建、单元测试和端到端测试。

## 数据库迁移

### 1. 新建

当你修改了任何数据库实体的代码，具体来说就是被 typeorm 提供的 `@Entity()` 装饰过的那些类，可以运行以下脚本来让 typeorm 自动生成数据库迁移脚本：

```shell
$ npm run migration:generate
```

生成的数据库迁移脚本将被放置在 `src/database/migrations/` 目录下。

### 2. 还原

如果你想还原最近一次的数据库迁移脚本，可以运行如下命令：

```shell
$ npm run migration:revert
```

需要注意的是，每运行一次该命令，只会还原最近一次的数据库迁移脚本，如果你需要还原多次，需要连续运行该脚本相应的次数。

## 数据分页

本模版中使用了 [nestjs-paginate](https://github.com/ppetzold/nestjs-paginate) 来支持数据分页。

## 其他

### 1. 使用交互式环境

REPL(Read-Eval-Print-Loop) 是一个交互式环境，它接受单用户输入，执行它们，并将结果返回给用户。REPL 功能允许你直接从终端检查依赖关系图并调用提供者（和控制器）上的方法：

```shell
$ npm run start:repl
```
