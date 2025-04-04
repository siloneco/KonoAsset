## Not Released Yet

### 🚀新機能

### 🐛バグ修正
- エクスポート時に一時画像ファイルが含まれてしまう問題を修正
- 対応アバターやタグが増えすぎるとダイアログが見切れる問題を修正

### ⚙️その他

## 1.1.1

### 🚀新機能

### 🐛バグ修正
- アセット追加時に画像を選ぶとエラーになることがある問題を修正
- KonoAsset形式でエクスポートしたzipが破損する問題を修正

### ⚙️その他
- 変更履歴のGitHubリンクを CHANGELOG.md に変更

## 1.1.0

### 🚀新機能
- アセットデータのインポート/エクスポート機能を追加
  - 歯車マークから「データの移行」タブを選択するとインポート/エクスポートが可能です
- アセット追加ダイアログを開くための Deep Link をサポート
  - `konoasset://addAsset` から始まる URL でアセット追加ダイアログを開くことができるようになりました
- アップデート時にプログレスバーと変更履歴を表示する機能を実装
- アセットの表示サイズの変更機能とリスト形式での表示を実装

### 🐛バグ修正
- アセット削除時に前提アセットの紐づけが解除されない問題を修正
- アセットタイプの表示が改行されることがある問題を修正
- 全てのアセットタイプを表示しているときにワールドカテゴリが候補として表示されない問題を修正
- 画面をリロードするまでカテゴリ等の候補が更新されない問題を修正
- en-US の翻訳の一部を修正
- エラーがログファイルに記録されないことがある問題を修正
- 初期設定ページで一部トーストの文字が翻訳されていなかった問題を修正
- トーストのタイトルの一貫性を向上
- フィルタの候補が見づらく選択しづらい問題を修正
  - 下方向にしか表示されなかったのを上方向にも表示されるようにしました
- 設定ファイルのロードに失敗した時、言語ファイルが読み込まれない問題を修正
  - この場合、英語(en-US)で言語ファイルが読み込まれます
- "Booth" 表記を "BOOTH" 表記に修正

### ⚙️その他

## 1.0.2

### 🚀新機能

### 🐛バグ修正

### ⚙️その他
- インポート元ファイル/フォルダを削除する機能をデフォルトでOFFに変更

## 1.0.1

### 🚀新機能

### 🐛バグ修正
- データディレクトリを変更してから再起動するまで、BOOTHの画像が保存できないバグを修正

### ⚙️その他

## 1.0.0

初回リリース
