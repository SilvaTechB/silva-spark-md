---
name: Imported WhatsApp bot dependency constraints
description: Dependency and runtime constraints found while diagnosing this imported Baileys bot.
---

The Replit package firewall may block both GitHub-sourced Baileys packages and unsafe placeholder shims pulled by unrelated dependencies. Do not bypass the firewall; prefer a safe registry release only when it is available and compatible.

**Why:** The imported dependency tree included a moving GitHub Baileys source and a deprecated package that requested `fs@0.0.1-security`, preventing a clean install.

**How to apply:** When this bot is set up again, inspect dependency install output before changing application code, and keep WhatsApp credentials out of logs and source files.