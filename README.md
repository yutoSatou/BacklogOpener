# Backlog Opener

登録済みのラベル名ごとに課題番号を入力して、対応する Backlog の課題詳細画面を開く Chrome 拡張機能です。

## 使い方

1. Chrome の拡張機能管理画面で「デベロッパーモード」を有効化します。
2. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択します。
3. 拡張機能のオプション画面を開き、`ラベル名,ドメイン名,プロジェクト名` を 1 行ずつ登録します。
4. 拡張機能アイコンを押すと、登録済みラベルごとの行が表示されます。
5. 開きたいラベルの行の課題番号欄に数字を入力し、その行の「開く」ボタンを押します。
6. そのラベルに対応する設定に対して `https://<domain>/view/<プロジェクト名>-<課題番号>` を新規タブで開きます。

## 登録できる値

- `ISID WinC,isidwinc.backlog.jp,ProjectName`
- `開発B,https://example.backlog.com,AnotherProject`

保存時にはドメインはホスト名へ正規化され、同一の `ラベル名 + ドメイン名 + プロジェクト名` の重複は自動で除去されます。

例: `ISID WinC,isidwinc.backlog.jp,ProjectName` と課題番号 `4507` を指定すると、`https://isidwinc.backlog.jp/view/ProjectName-4507` を開きます。
