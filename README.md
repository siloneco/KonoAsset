# VRC Asset Manager (仮)

VRChat 向けのアバターアセットやワールドアセットを管理するデスクトップアプリ

## 開発環境セットアップ

以下をインストールすると良いです

- [VS Code](https://code.visualstudio.com/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/en/download/package-manager)

### 推奨のVSCode拡張機能

以下は推奨のVSCode拡張機能です。上の方が優先度高めです。

- [rust](https://marketplace.visualstudio.com/items?itemName=1YiB.rust-bundle) - Rust開発向け拡張機能パック
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) - Tauri用拡張機能
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) = Tailwindの自動補完
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - コードフォーマット
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - コードフォーマット
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) - エラーのエディタ内表示
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors) - TypeScriptのエラー解析
- [Dependi](https://marketplace.visualstudio.com/items?itemName=fill-labs.dependi) - 依存関係のアップデート確認
- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag) - HTMLタグの自動補完
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) - HTML閉じタグの自動名前変更
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - スペルチェック

## パッケージインストール

以下のコマンドで Node.js のパッケージをインストールします

```
pnpm i
```

Rust のパッケージは Tauri を実行した時にインストールされます

## Devモードでの実行

`pnpm tauri dev` を実行することによりアプリケーションを起動できます。  
Viteのソースコードを変更した場合は自動で更新されます。場合によってはアプリケーションで `Ctrl-R` が必要なことがあります。  
Rustのコードを変更した場合はアプリケーションが再起動されます。

## コードのフォーマット等

以下のコマンドでコードのフォーマットが行えます

```bash
# フォーマット実行
pnpm run fmt

# Lintエラーの確認
pnpm run lint

# TypeScriptのタイプテスト
pnpm run type-check
```

## ビルド

以下のコマンドでリリースビルドの作成(インストーラーの作成)が可能です。

```
pnpm run build
```
