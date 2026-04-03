# Changelog

All notable changes to the mss-boot-admin frontend will be documented in this file.

## [Unreleased]

### Fixed

- Removed undefined status variable usage in Login page
- Fixed Department/Post navigation redirect paths (`/departments`, `/posts`)
- Fixed password reset success branch logic
- Added cleanup for polling intervals in NoticeIcon and Generator
- Removed invalid `skipErrorHandler` parameter from API calls
- Fixed NotificationContext import paths and API method names
- Removed duplicate keys in locale files
- Fixed undefined index access in Log pages
- Fixed Access component property usage

### Changed

- Removed double PageContainer wrapper in AppConfig page
- Unified page skeleton consistency across key pages
- Created reusable AuthShell component for auth pages
- Extracted useMonitorData hook for monitor data fetching

### Added

- Loading/error states for monitor data
- Visible error feedback on monitor fetch failures
- Better error handling with retry capability

### Removed

- Duplicate layout code in login/register/forget pages (44 lines reduced)

## Version History

| Version | Date | Description |
|---------|------|-------------|
| Unreleased | 2026-04-03 | Product polish and bug fixes |

---

## Upgrade Instructions

```bash
# 1. Pull latest code
git pull origin main

# 2. Update dependencies
pnpm install

# 3. Build
pnpm build
```

---

## License

MIT