For the English guide, please refer to [CONTRIBUTING-en.md](CONTRIBUTING-en.md)

---
# Contribution Guide for KonoAsset

KonoAssetへのコントリビューションに興味を持っていただきありがとうございます。

このドキュメントでは、安定した開発体験を維持するために守って欲しいことについて記述しています。  
また、コントリビューションを行う場合必ず [Code of Conduct](CODE_OF_CONDUCT.md) を遵守してください。


## 使用言語について

このプロジェクトでは日本語を主要言語として使用します。  
ただし、これは日本語でのコミュニケーションを強要するものでは**ありません**。

あなたは母国語を使用して Issue や PR を書くことができ、日本語のコメントに対しても日本語で返信する必要はありません。  
これにより読み手は自由な翻訳ツールを利用し、最大限あなたの正確な意図を読みとることができます。


## コントリビューションの方法

KonoAssetへのコントリビューションを行う時、必ずしもコードに変更を加える必要はありません。例えば、

- コードを書いて Pull Request を作成する
- バグ報告や機能リクエストに関する Issue を作成する
- 翻訳ファイルを作成または修正する
- ドキュメントを作成または改善する
- [Discussions](https://github.com/siloneco/KonoAsset/discussions) に寄せられた質問等に回答する

など、様々なコントリビューションの形があります。


### Issues

コードに変更を加える前には [Issue](https://github.com/siloneco/KonoAsset/issues) を作成し、どのような変更を加えるのかについて議論を行うことを推奨します。  
コードの変更に無関係な質問やトラブルシューティングなどは [Discussions](https://github.com/siloneco/KonoAsset/discussions) で行ってください。

Issue の解決に取り組む場合には、作業の衝突を避けるために自分自身をアサインしてください。  
もしアサインする権限がない場合はコメント等を残し、その旨を表明してください。

> [!WARNING]
> 新しい Issue を作成する前に、重複する Issue が無いか確認してください。  
> また、実装方針が決まったとしても、コードが完全にマージされるまで Issue は Close しないでください。


### Pull Requests

Pull Request を作成する場合、以下のことを守ってください。

1. その変更に関連する Issue または Security Advisory が存在すること (無い場合は作成してください)
2. レビューしやすいように、最低限の変更に留めること
3. (可能な限り) ブランチ名に prefix を付けること ( `feat/`, `fix/`, `perf/`, `docs/` など )
4. (可能な限り) UI の変更がある場合、スクリーンショットを添付すること

言語ファイルに新しく項目が増える場合、必ずしも全ての言語ファイルをあなたが埋める必要はありません。  
PR 作成後に、その言語に長けた人へ翻訳ファイルの作成を依頼することができます。


### セキュリティに関係する報告

もし脆弱性やそれに関係したバグを発見した場合、[GitHub Security Advisories](https://github.com/siloneco/KonoAsset/security/advisories/new) から問題を報告してください。  
また、修正のコミットを自身で作成する場合、状況に応じて以下の対応を行ってください。

- 修正配信前に PoC (Proof of Concept) が公開されることが危険だと考えられる場合
  - [Private Fork](https://docs.github.com/ja/code-security/security-advisories/working-with-repository-security-advisories/collaborating-in-a-temporary-private-fork-to-resolve-a-repository-security-vulnerability) 等で修正のコミットを作成し、コントリビューターへ共有してください
- 修正配信前に PoC を公開しても問題ないと考えられる軽度な脆弱性の場合
  - 通常の PR 作成の手順に従ってください
- 上記の判断がつかない場合
  - 一般公開せず、Private Fork へコミットしてください


### ライセンス

あなたのコントリビューションはプロジェクトと同じライセンスの下で公開されます。  
詳細については [LICENSE](LICENSE) ファイルを参照してください。


## 開発環境のセットアップ

以下をインストールしてください。

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js (v23)](https://nodejs.org/en/download/package-manager)
- [pnpm](https://pnpm.io/ja/installation) (`npm i -g pnpm`)

エディタは [VSCode](https://code.visualstudio.com/) を推奨していますが、好みに応じて自由なものを利用できます。


### フロントエンドのパッケージインストール

以下のコマンドで Node.js のパッケージをインストールします

```
pnpm i
```

Rust のパッケージは Tauri を実行した時にインストールされます


### Devモードでの実行

`pnpm tauri dev` を実行することによりアプリケーションを起動できます。

フロントエンドのソースコードを変更した場合は自動で更新されます。  
反映されない場合、アプリケーション側で `Ctrl-R` を実行し、全体リロードを行うことで解決する場合があります。  

バックエンドのコードを変更した場合はアプリケーションが自動で再起動されます。

> [!NOTE]
> バックエンドのコードを変更する場合、セーブするたびに dev ビルドが走り開発体験が悪いため、テストしたい時のみ実行することをおすすめします。


### コードの解析 (フロントエンド)

以下のコマンドでフロントエンドのコードの解析が行えます。

```bash
# フォーマット実行
pnpm run fmt

# Lintエラーの確認
pnpm run lint

# TypeScriptのタイプテスト
pnpm run type-check
```


### ビルド

以下のコマンドで exe の作成が可能です。

```
pnpm tauri build --no-bundle
```
