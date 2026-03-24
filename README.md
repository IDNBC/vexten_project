# Vexten Development Chronicles: The WASM Wall

This project, Vexten, was an ambitious attempt to run AI entirely within a browser extension without relying on external servers, using only the power of the user's PC. Unfortunately, it failed due to fundamental limitations in Chrome extension security policies. This README documents the journey, the challenges faced, and the lessons learned, shared here as a resource for future developers.

## What We Tried to Do

We aimed to create a **privacy-focused browser extension (Vexten) that runs AI entirely locally on the user's PC, without any external server dependencies**. This was a cutting-edge approach prioritizing user privacy and data security.

- **Tool**: transformers.js (the AI engine)
- **Fuel**: multilingual-e5-small (an AI model that converts text into numerical vectors)
- **Location**: Chrome extension's "background" (Offscreen Document)

## The Three Major Walls We Hit

### 1. Manifest V3's WASM Ban
Modern Chrome extensions (Manifest V3) strictly limit the execution of WebAssembly (WASM) for security reasons. The `script-src 'self'` rule prohibits running any executable formats other than the extension's own JavaScript.

- **Our Countermeasure**: Switched to "WASM-free mode" (pure JavaScript mode) to avoid violating the rules.

### 2. Transformers.js's "Overzealous Feature"
The high-performance transformers.js library automatically checks for WASM availability upon startup, even when configured not to use it. This brief check triggered Chrome's security enforcement, causing the program to be forcibly terminated.

- **Our Countermeasures**: Attempted to disguise folder structures and load the library dynamically to bypass the check, but Chrome's detection was too sharp.

### 3. External Communication Blockage (Failed to fetch)
Chrome extensions dislike unauthorized downloads of large files (like AI models) from the internet. When the AI attempted to fetch necessary data from Hugging Face, Chrome blocked the communication.

- **Our Countermeasure**: Manually downloaded all model files and placed them directly in the extension folder for complete localization.

## Why Did It Ultimately Fail?

In the end, **even a single line of WebAssembly-related code in transformers.min.js makes execution impossible** under Chrome's extremely strict Content Security Policy (CSP). While websites can relax these settings, the background environment of Chrome extensions is the most secure "sanctuary" in the browser. Running WASM-based libraries here is effectively blocked by standard means as of 2024.

## Lessons Learned from This Failure (For Beginners)

- **Browsers Choose "Inconvenience" for "Safety"**: To protect users, extensions are thoroughly prevented from performing arbitrary advanced processing (like WASM).
- **Hidden Behaviors in Libraries**: Even if your own code is correct, the underlying actions of libraries (like Transformers.js) can violate environment-wide rules.
- **The Difficulty of Local AI**: Achieving "complete AI functionality within the browser" is one of the most challenging areas in web development today, essentially battling browser specifications.

## Project Structure

- `manifest.json`: Extension manifest
- `popup/`: Popup interface files
- `scripts/`: Background scripts, content scripts, and worker files
- `lib/`: Library files (including transformers.min.js)
- `models/`: Pre-downloaded AI models
- `icons/`: Extension icons

This project serves as a testament to the challenges of pushing the boundaries of browser-based AI and the importance of understanding platform limitations.

---

# Vexten開発記：WASMの壁

このプロジェクト「Vexten」は、ブラウザ拡張機能の中で外部サーバーを一切使わず、自分のPCのパワーだけでAIを動かすという、非常に先進的でプライバシーに配慮した設計を目指しました。しかし、Chrome拡張機能のセキュリティポリシーの根本的な制約により失敗しました。このREADMEでは、その試みの経緯、ぶつかった壁、そして学んだ教訓を記録し、今後の開発者への参考として公開します。

## 私たちがやろうとしたこと

**「ブラウザ拡張機能（Vexten）の中で、外部サーバーを一切使わず、自分のPCのパワーだけでAIを動かす」**という、プライバシーを重視した革新的なアプローチを目指しました。

- **道具**: transformers.js（AIを動かすエンジン）
- **燃料**: multilingual-e5-small（文章をベクトルという数値に変えるAIモデル）
- **場所**: Chrome拡張機能の「バックグラウンド（Offscreen Document）」

## ぶつかった3つの大きな壁

### 1. Manifest V3 の「WASM禁止令」
現代のChrome拡張機能（Manifest V3）では、セキュリティ上の理由から、プログラムを高速実行するための技術 WebAssembly (WASM) の実行がデフォルトで厳しく制限されています。`script-src 'self'` というルールにより、自分自身のプログラム（JS）以外、勝手な実行形式（WASM）は動かしてはいけません。

- **私たちの対策**: 「WASMを使わないモード（純粋なJavaScriptモード）」に切り替えて、ルールに触れないように設定しました。

### 2. Transformers.js の「おせっかい機能」
AIエンジンである transformers.js は、高性能ゆえに、裏側で「WASMが使えるかどうか」を自動でチェックしようとします。私たちが「WASMは使わないで！」と設定していても、ライブラリが起動した瞬間に一瞬だけWASMを触りに行きます。その一瞬の動作をChromeの検察官が見逃さず、「ルール違反だ！」とプログラムを強制終了させてしまいました。

- **私たちの対策**: フォルダ構造を偽装したり、ライブラリを後から読み込んだりして、このチェックを回避しようとしましたが、検察官の目はそれ以上に鋭かったのです。

### 3. 外部通信の遮断（Failed to fetch）
Chrome拡張機能は、勝手に大きなファイル（AIモデルなど）をネットからダウンロードすることを嫌がります。AIが「計算に必要なデータをネット（Hugging Face）に取りに行くね」と言った瞬間、Chromeが通信を遮断しました。

- **私たちの対策**: モデルファイルをすべて手動でダウンロードし、拡張機能のフォルダの中に直接入れる「完全ローカル化」で対応しました。

## なぜ最終的に失敗したのか？

結論から言うと、**「transformers.min.js というファイルの中身に、WebAssemblyを動かそうとする記述が1行でもあるだけで、実行が許されない」**という、Chromeの極めて厳しいセキュリティ・ポリシー（CSP）に阻まれました。通常、Webサイトであれば許可を緩める設定も可能ですが、Chrome拡張機能のバックグラウンド環境は、ブラウザの中で最もセキュリティが厳しい「聖域」です。ここでWASM系のライブラリを動かすことは、2024年現在の標準的な手段では封じられているのが実情です。

## この失敗から学べること（初学者への教訓）

- **ブラウザは「安全」のために「不自由」を選んでいる**: ユーザーを守るために、拡張機能が勝手な高度な処理（WASM）を行うことを徹底的に排除しています。
- **ライブラリの「隠れた挙動」**: 自分で書いたコードが正しくても、使っているライブラリ（Transformers.jsなど）が裏で何をしているかによって、環境全体のルールに抵触することがあります。
- **ローカルAIの難しさ**: 「ブラウザの中だけでAIを完結させる」のは、Web開発において現在最も難易度が高い（というか、ブラウザの仕様と戦うことになる）領域の一つです。

## プロジェクト構造

- `manifest.json`: 拡張機能のマニフェスト
- `popup/`: ポップアップインターフェースファイル
- `scripts/`: バックグラウンドスクリプト、コンテンツスクリプト、ワーカーファイル
- `lib/`: ライブラリファイル（transformers.min.jsを含む）
- `models/`: 事前ダウンロード済みのAIモデル
- `icons/`: 拡張機能アイコン

このプロジェクトは、ブラウザベースのAIの限界に挑戦した証であり、プラットフォームの制約を理解することの重要性を示しています。