# mss-boot-admin-antd

[![Build Status](https://github.com/mss-boot-io/mss-boot-admin/workflows/CI/badge.svg)](https://github.com/mss-boot-io/mss-boot-admin) [![Release](https://img.shields.io/github/v/release/mss-boot-io/mss-boot-admin.svg?style=flat-square)](https://github.com/mss-boot-io/mss-boot-admin/releases) [![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/mss-boot-io/mss-boot-admin)

[English](./README.md) | 简体中文

## 简介

> `mss-boot-admin-antd` 是 mss-boot admin 平台的前端部分。当前产品主线正在收敛为治理、运营、访问控制、配置能力，以及 AI 注解协同驱动的研发流程，而不再以动态模型或代码生成为核心方向。

## 教程

[在线文档](https://docs.mss-boot-io.top) [视频教程](https://space.bilibili.com/597294782/channel/seriesdetail?sid=3881026)

## 项目地址

[后端项目](https://github.com/mss-boot-io/mss-boot-admin) [前端项目](https://github.com/mss-boot-io/mss-boot-admin-antd)

## 🎬 体验环境

[体验地址](https://admin-beta.mss-boot-io.top)

> 账号：admin 密码：123456

## ✨ 特性

- 支持国际化
- 标准 Restful API 开发规范
- 基于 Casbin 的 RBAC 权限管理
- 基于 Gorm 的数据库存储
- 基于 Gin 的中间件开发
- 基于 Gin 的 Swagger 文档生成
- 支持 oauth2.0 第三方登录
- 支持 swagger 文档生成
- 支持多种配置源(本地文件、embed、对象存储 s3 等、gorm 支持的数据库、mongodb)
- 支持数据库迁移
- 支持用户、角色、部门、岗位、菜单、API、配置等治理型后台能力
- 支持通知、任务、监控、统计等运营型能力

## 📦 内置功能

- 用户管理: 用户是系统操作者，该功能主要完成系统用户配置。
- 部门管理: 管理组织树结构，支撑数据归属与权限边界。
- 岗位管理: 管理岗位信息，辅助组织与权限配置。
- 角色管理: 角色菜单权限分配、设置角色按机构进行数据范围权限划分。
- 菜单管理: 配置系统菜单，操作权限，按钮权限标识等。
- API 管理: 维护系统接口注册信息，辅助权限与接口治理。
- 选项管理: 动态配置枚举。
- 系统配置: 管理各种环境的配置。
- 通知公告: 用户通知消息。
- 任务管理: 管理定时任务，包括执行日志。
- 国际化管理: 管理国际化资源。
- 账号与令牌管理: 支持 OAuth2 绑定、个人令牌等账号安全能力。
- 监控与统计: 支持基础监控信息与统计查询接口。

## 📦 准备工作

- 安装 golang1.21+
- 安装 mysql8.0+
- 安装 nodejs18.16.0+

## 📦 快速开始

### 1. 下载项目

```shell
# 下载后端项目
git clone https://github.com/mss-boot-io/mss-boot-admin.git
# 下载前端项目
git clone https://github.com/mss-boot-io/mss-boot-admin-antd.git
```

### 2. 迁移数据库

```shell
# 进入后端项目
cd mss-boot-admin
# 配置数据库连接信息(可根据实际情况修改)
export DB_DSN="root:123456@tcp(127.0.0.1:3306)/mss-boot-admin-local?charset=utf8mb4&parseTime=True&loc=Local"
# 迁移数据库
go run main.go migrate
```

### 3. 生成 API 接口信息

```shell
# 生成api接口信息
go run main.go server -a
```

### 4. 启动后端服务

```shell
# 启动后端服务
go run main.go server
```

### 5. 启动前端服务

```shell
# 进入前端项目
cd mss-boot-admin-antd
# 安装依赖
npm install
# 启动前端服务
npm run start
```

## 📨 互动

<table>
   <tr>
    <td><img src="https://mss-boot-io.github.io/.github/images/wechat.jpg" width="180px"></td>
    <td><img src="https://mss-boot-io.github.io/.github/images/wechat-mp.jpg" width="180px"></td>
    <td><img src="https://mss-boot-io.github.io/.github/images/qq-group.jpg" width="200px"></td>
    <td><a href="https://space.bilibili.com/597294782/channel/seriesdetail?sid=3881026&ctype=0">mss-boot-io</a></td>
  </tr>
  <tr>
    <td>微信</td>
    <td>公众号🔥🔥🔥</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=0f2bf59f5f2edec6a4550c364242c0641f870aa328e468c4ee4b7dbfb392627b"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="mss-boot技术交流群" title="mss-boot技术交流群"></a></td>
    <td>哔哩哔哩🔥🔥🔥</td>
  </tr>
</table>

## 💎 贡献者

<span style="margin: 0 5px;" ><a href="https://github.com/lwnmengjing" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/12806223?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span> <span style="margin: 0 5px;" ><a href="https://github.com/wangde7" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/56955959?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>

## JetBrains 开源证书支持

`mss-boot-io` 项目一直以来都是在 JetBrains 公司旗下的 GoLand 集成开发环境中进行开发，基于 **free JetBrains Open Source license(s)** 正版免费授权，在此表达我的谢意。

<a href="https://www.jetbrains.com/?from=kubeadm-ha" target="_blank"><img src="https://raw.githubusercontent.com/panjf2000/illustrations/master/jetbrains/jetbrains-variant-4.png" width="250" align="middle"/></a>

## 🤝 特别感谢

1. [ant-design](https://github.com/ant-design/ant-design)
2. [ant-design-pro](https://github.com/ant-design/ant-design-pro)
3. [gin](https://github.com/gin-gonic/gin)
4. [casbin](https://github.com/casbin/casbin)
5. [gorm](https://github.com/jinzhu/gorm)
6. [gin-swagger](https://github.com/swaggo/gin-swagger)
7. [jwt-go](https://github.com/dgrijalva/jwt-go)
8. [oauth2](https://pkg.go.dev/golang.org/x/oauth2)

## 🔑 License

[MIT](https://github.com/mss-boot-io/mss-boot-admin/blob/main/LICENSE)

Copyright (c) 2024 mss-boot-io
