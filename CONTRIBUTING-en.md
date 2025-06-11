日本語のガイドは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

---
# Contribution Guide for KonoAsset

Thank you for your interest in contributing to KonoAsset.

This document outlines the guidelines to maintain a stable development experience.
Additionally, when contributing, you must follow the [Code of Conduct](CODE_OF_CONDUCT.md).


## Language Usage

This project primarily uses Japanese.
However, this does **not** mean that communication must be in Japanese.

You are free to use your native language when creating Issues or PRs, and you are not required to respond in Japanese to Japanese comments.
This allows readers to use translation tools of their choice to understand your intent as accurately as possible.


## How to Contribute

Contributing to KonoAsset does not necessarily mean modifying the code. You can contribute in various ways, such as:

- Writing code and creating a Pull Request
- Creating an Issue for bug reports or feature requests
- Creating or improving translation files
- Writing or improving documentation
- Answering questions in [Discussions](https://github.com/siloneco/KonoAsset/discussions)


### Issues

Before modifying code, we recommend creating an [Issue](https://github.com/siloneco/KonoAsset/issues) to discuss the proposed changes.  
For unrelated questions or troubleshooting, please use [Discussions](https://github.com/siloneco/KonoAsset/discussions).

If you decide to work on an Issue, please assign yourself to avoid conflicts.
If you lack permission to self-assign, leave a comment to indicate your intent.

> [!WARNING]
> Before creating a new Issue, check for duplicates.  
> Also, even if an implementation approach is decided, do not close the Issue until the code is fully merged.


### Pull Requests

When creating a Pull Request, please follow these guidelines:
1. Ensure there is a related Issue or Security Advisory (create one if necessary).
2. Keep changes minimal to facilitate review.
3. (If possible) Use a prefix for branch names (e.g., `feat/`, `fix/`, `perf/`, `docs/`).
4. (If possible) Attach screenshots for UI changes.

If new language file entries are added, you do not need to fill out all translations yourself.  
After creating a PR, you can request translation contributions from others.


### Security Reports

If you discover a vulnerability or security-related bug, report it through [GitHub Security Advisories](https://github.com/siloneco/KonoAsset/security/advisories/new).  
If you plan to commit a fix yourself, follow these guidelines based on the severity:
- If revealing a PoC (Proof of Concept) before the fix is released is risky:
  - Create the fix in a [Private Fork](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/collaborating-in-a-temporary-private-fork-to-resolve-a-repository-security-vulnerability) and share it with contributors.
- If revealing a PoC before the fix is acceptable for minor vulnerabilities:
  - Follow the standard PR process.
- If uncertain about the risk level:
  - Do not disclose publicly and commit to a Private Fork instead.

 
### License

Your contributions will be published under the same license as the project.  
See the [LICENSE](LICENSE) file for details.


## Setting Up the Development Environment

Install the following dependencies:

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js (v23)](https://nodejs.org/en/download/package-manager)
- [pnpm](https://pnpm.io/ja/installation) (`npm i -g pnpm`)

We recommend using [VSCode](https://code.visualstudio.com/), but you can use any editor you prefer.


### Installing Frontend Packages

Run the following command to install Node.js packages:

```
pnpm i
```

Rust dependencies will be installed automatically when running Tauri.


### Running in Dev Mode

Run `pnpm tauri dev` to start the application.

Frontend code changes will trigger automatic updates.  
If updates do not appear, try refreshing with `Ctrl-R`.

Backend code changes will trigger an automatic restart.

> [!NOTE]
> Modifying backend code triggers a dev build on every save, which can slow development.  
> It is recommended to restart only when necessary.

### Code Analysis (Frontend)

Run the following commands to analyze frontend code:

```bash
# フォーマット実行
pnpm run fmt

# Lintエラーの確認
pnpm run lint

# TypeScriptのタイプテスト
pnpm run type-check
```


### Building
Run the following command to create an executable:

```
pnpm tauri build --no-bundle
```
