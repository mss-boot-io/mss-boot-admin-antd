# 2026-06-05 前端 CI 失败复盘

## 现象

`mss-boot-admin-antd` 的 Dependabot PR 大量触发 `(alpha)Deploy To Cloudflare`，但 Dependabot 无法读取仓库 secret，导致 Cloudflare 发布失败。CI、CodeQL 等基础检查本身不是主要问题。

## 处理

- 在 alpha Cloudflare workflow 上跳过 `dependabot[bot]` 和 `dependabot/*` 分支。
- Scorecard 权限从 workflow 顶层收窄到 job 级别。

## 验证

- `go run github.com/rhysd/actionlint/cmd/actionlint@latest`
- `git diff --check`

## 后续

前端仍遵循低频 Cloudflare 发布策略：本地开发和 CI 先验证，只有达到可对外展示状态后才发布到 beta/prod。
