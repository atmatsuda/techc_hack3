# TECHC_HACK3

## プロジェクト概要

### AI RPG × IoT

歩数・心拍数・勉強時間・睡眠時間など、現実世界での活動をゲーム内の経験値やステータスへ変換するアプリケーションです。

日常生活での行動によってキャラクターが成長し、現実世界をRPGのように楽しめる仕組みを作ります。

### 利用イメージ

```text
今日の活動

歩数：8,000歩
勉強時間：2時間
睡眠時間：7時間

↓ 活動データを分析

HP      +20
筋力    +5
知力    +3
経験値  +100

LEVEL UP
```

---

## 使用技術

### フロントエンド

- React
- TypeScript
- Vite

### バックエンド

- Python
- FastAPI

### 開発管理

- Git
- GitHub

---

## フォルダー構成

```text
TECHC_HACK3/
├── backend/
│   ├── .venv/
│   ├── __pycache__/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
└── README.md
```

---

## 各フォルダー・ファイルの役割

### backend

PythonとFastAPIを使用して、APIやデータ処理を実装するフォルダーです。

#### `backend/main.py`

FastAPIアプリケーションの起点となるファイルです。

主に以下の処理を実装します。

- APIの作成
- フロントエンドから送信されたデータの受付
- 経験値やステータスの計算
- 計算結果の返却

#### `backend/requirements.txt`

バックエンドで使用するPythonライブラリを管理するファイルです。

#### `backend/.venv`

Pythonの仮想環境です。

このフォルダーは個人の開発環境で使用するため、GitHubにはプッシュしません。

---

### frontend

React、TypeScript、Viteを使用して画面を実装するフォルダーです。

#### `frontend/public`

画像やアイコンなど、直接公開する静的ファイルを配置します。

#### `frontend/src`

Reactのソースコードを管理します。

#### `frontend/src/assets`

画像など、画面内で使用する素材を配置します。

#### `frontend/src/App.tsx`

アプリケーションのメイン画面を実装します。

#### `frontend/src/App.css`

`App.tsx`で使用するスタイルを記述します。

#### `frontend/src/main.tsx`

Reactアプリケーションを起動するためのファイルです。

#### `frontend/src/index.css`

アプリケーション全体に適用するスタイルを記述します。

#### `frontend/package.json`

フロントエンドで使用するライブラリや、実行コマンドを管理します。

#### `frontend/node_modules`

インストールしたライブラリが保存されるフォルダーです。

このフォルダーはGitHubにはプッシュしません。

---

## 開発を始める準備

### 1. リポジトリをクローンする

```bash
git clone https://github.com/omochi05/techc-hackthon.git
```

### 2. プロジェクトフォルダーへ移動する

```bash
cd techc-hackthon
```

### 3. ブランチを確認する

```bash
git branch -a
```

### 4. 最新の情報を取得する

```bash
git switch main
git pull origin main
```

---

## フロントエンドの起動方法

### 1. frontendフォルダーへ移動する

```bash
cd frontend
```

### 2. 必要なライブラリをインストールする

初回のみ実行します。

```bash
npm install
```

### 3. Reactを起動する

```bash
npm run dev
```

起動後、ターミナルに表示されたURLをブラウザで開きます。

例：

```text
http://localhost:5173/
```

### 4. Reactを停止する

ターミナル上で次のキーを押します。

```text
Ctrl + C
```

---

## バックエンドの起動方法

プロジェクトのルートフォルダーから操作します。

### 1. backendフォルダーへ移動する

```bash
cd backend
```

### 2. Pythonの仮想環境を作成する

初回のみ実行します。

```bash
python -m venv .venv
```

### 3. 仮想環境を有効化する

#### Windows Git Bash

```bash
source .venv/Scripts/activate
```

#### Windows コマンドプロンプト

```cmd
.venv\Scripts\activate
```

#### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

### 4. 必要なライブラリをインストールする

```bash
pip install -r requirements.txt
```

### 5. FastAPIを起動する

```bash
uvicorn main:app --reload
```

起動後、以下のURLへアクセスします。

```text
http://127.0.0.1:8000
```

APIの確認画面は以下です。

```text
http://127.0.0.1:8000/docs
```

### 6. FastAPIを停止する

```text
Ctrl + C
```

### 7. 仮想環境を終了する

```bash
deactivate
```

---

## Gitを使用した開発手順

開発では、直接`main`ブランチを編集しません。

必ず作業ごとに新しいブランチを作成します。

### 1. mainブランチへ移動する

```bash
git switch main
```

### 2. mainブランチを最新の状態にする

```bash
git pull origin main
```

### 3. 作業用ブランチを作成する

```bash
git switch -c ブランチ名
```

例：

```bash
git switch -c feat_004-character-ui
```

### 4. 現在のブランチを確認する

```bash
git branch
```

現在いるブランチの左側に`*`が表示されます。

```text
  main
* feat_004-character-ui
```

### 5. ファイルを編集する

担当する機能のファイルを編集します。

### 6. 変更内容を確認する

```bash
git status
```

具体的な変更内容を確認する場合は、以下を実行します。

```bash
git diff
```

### 7. 変更したファイルをステージングする

すべての変更を追加する場合：

```bash
git add .
```

ファイルを指定する場合：

```bash
git add ファイル名
```

例：

```bash
git add frontend/src/App.tsx
```

### 8. コミットする

```bash
git commit -m "コミットメッセージ"
```

例：

```bash
git commit -m "feat: キャラクター画面を追加"
```

### 9. GitHubへプッシュする

初回のプッシュ：

```bash
git push -u origin ブランチ名
```

例：

```bash
git push -u origin feat_004-character-ui
```

2回目以降：

```bash
git push
```

### 10. Pull Requestを作成する

GitHubを開き、作業ブランチから`main`ブランチへのPull Requestを作成します。

```text
作業ブランチ
↓ Pull Request
main
```

Pull Requestの内容を確認し、問題がなければ`main`へマージします。

---

## Gitの基本コマンド

### 状態を確認する

```bash
git status
```

変更したファイルや、コミットされていない内容を確認します。

### ブランチを確認する

```bash
git branch
```

### リモートブランチも含めて確認する

```bash
git branch -a
```

### ブランチを切り替える

```bash
git switch ブランチ名
```

### 新しいブランチを作成する

```bash
git switch -c ブランチ名
```

### 最新の変更を取得する

```bash
git pull origin main
```

### 変更内容を確認する

```bash
git diff
```

### 変更をステージングする

```bash
git add .
```

### 変更をコミットする

```bash
git commit -m "メッセージ"
```

### GitHubへプッシュする

```bash
git push
```

### コミット履歴を確認する

```bash
git log --oneline
```

### リモートリポジトリを確認する

```bash
git remote -v
```

---

## ブランチの命名ルール

ブランチ名は、以下の形式で統一します。

```text
種類_タスクID-作業内容
```

例：

```text
feat_001-readme-init
feat_002-project-setup
feat_003-basic-learning
feat_004-character-ui
```

### ブランチの種類

| 種類 | 用途 |
|---|---|
| `feat` | 新しい機能やタスク |
| `fix` | 不具合の修正 |
| `docs` | ドキュメントの修正 |
| `refactor` | 動作を変えないコード整理 |

---

## コミットメッセージのルール

コミットメッセージは、以下の形式で記述します。

```text
種類: 変更内容
```

例：

```text
feat: キャラクター画面を追加
fix: 経験値計算の不具合を修正
docs: READMEに開発手順を追加
refactor: API処理を整理
```

### コミットの種類

| 種類 | 用途 |
|---|---|
| `feat` | 新しい機能の追加 |
| `fix` | 不具合の修正 |
| `docs` | READMEなどの修正 |
| `style` | 見た目やコードの整形 |
| `refactor` | コードの整理 |
| `test` | テストの追加や修正 |
| `chore` | 設定や環境構築の変更 |

---

## 開発時の注意事項

- `main`ブランチで直接開発しない
- 作業開始前に`main`を最新の状態にする
- 1つのブランチでは、1つのタスクだけを行う
- 作業内容が分かるコミットメッセージを書く
- 関係のないファイルを一緒にコミットしない
- `.venv`や`node_modules`をGitHubへプッシュしない
- 他の人が作成したコードを削除する前に確認する
- エラーが発生した場合は、エラー文を省略せず共有する
- Pull Requestを作成してから`main`へ取り込む

---