# Nest API Boilerplate

本项目旨在提供一个以 [nestjs](https://nestjs.com/) 为基础的 API 工程模版，它已经包含或即将包含如下基本功能：

* Database
  * Migrations
* API
  * Authentication
    * Passport
      * Local strategy
      * LDAP strategy
      * JWT strategy
  * Authorization (TBD)
  * Health check
    * orm
    * memory
    * disk
    * http
* Testing
  * Unit testing framework
  * E2E testing framework

## 开发环境准备

### 1. 安装依赖

```shell
$ npm install
```

### 2. 启动开发环境基础设施

为了能快速在开发环境下开始工作，这里提供了一些开发环境需要用到的服务，它们将运行在 docker 容器中。

* postgres
* [pgweb](https://github.com/sosedoff/pgweb)
* [integresql](https://github.com/allaboutapps/integresql)

运行以下命令启动上述所有基础服务：

```shell
$ docker-compose -f docker-compose-dev-infra.yml up
```

### 3. 初始化开发环境数据库

创建开发环境数据库：

```shell
$ npm run db:create
```

### 4. 运行数据库迁移脚本

由于新搭建的开发环境中的开发数据库是全新的，没有任何模式，因此需要运行积累的迁移脚本来更新数据库模式：

```shell
$ npm run migration:run
```

### 5. 为数据库添加数据种子（可选）

这个步骤是可选的。如果项目中已经定义了一些数据种子，运行如下脚本可以快速将一些初始数据同步到数据库中：

```shell
$ npm run seed:run
```

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

## 数据库迁移

### 1. 新建

当你修改了任何数据库实体的代码，具体来说就是被 typeorm 提供的 `@Entity()` 装饰过的那些类，可以运行以下脚本来让 typeorm 自动生成数据库迁移脚本：

```shell
$ npm run migration:generate
```

生成的数据库迁移脚本将被放置在 `src/database/migrations/` 目录下。

### 2. 撤销

如果你想撤销最近一次的数据库迁移脚本，可以运行如下命令：

```shell
$ npm run migration:revert
```

需要注意的是，每运行一次该命令，只会撤销最近一次的数据库迁移脚本，如果你需要撤销多次，需要连续运行该脚本相应的次数。

## 其他

### 1. 使用交互式环境

REPL(Read-Eval-Print-Loop) 是一个交互式环境，它接受单用户输入，执行它们，并将结果返回给用户。REPL 功能允许你直接从终端检查依赖关系图并调用提供者（和控制器）上的方法：

```shell
$ npm run start:repl
```
