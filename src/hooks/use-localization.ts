// import { LocalizationContext } from '@/components/context/LocalizationContext'
import { LocalizationData } from '@/lib/bindings'
// import { useContext } from 'react'

type ReturnProps = {
  t: (id: string) => string
}

// export const useLocalization = (): ReturnProps => {
//   const { data } = useContext(LocalizationContext)

//   const t = (id: string): string => {
//     const value = data.data[id]

//     if (value === undefined) {
//       return ''
//     }

//     return value
//   }

//   return { t }
// }

export const useLocalization = (): ReturnProps => {
  const data: LocalizationData = {
    language: 'jaJp',
    data: {
      // ここに書く
      'general:button:forward': '進む',
      'general:button:back': '戻る',
      'general:button:next': '次へ',
      'general:button:close': '閉じる',
      'general:button:cancel': 'キャンセル',
      'general:button:delete': '削除',
      'general:button:save': '保存',
      'general:or': 'または',
      'general:error': 'エラー',
      'general:open': '開く',
      'general:complete': '完了',
      'general:cancelled': 'キャンセルされました',
      'general:failed': '失敗しました',
      'sidebar:text-search': 'テキストで検索',
      'addasset:success-toast': 'アセットが追加されました！',
      'addasset:cancel-toast': 'キャンセルされました',
      'addasset:error-toast': 'エラー: 追加に失敗しました',
      'addasset:error-toast:description': 'エラー内容はログを参照してください',
      'addasset:import-error-toast': 'データのインポートに失敗しました',
      'addasset:import-start-error-toast':
        'データのインポートを開始できませんでした',
      'addasset:prerequisite-assets': '前提アセット',
      'addasset:prerequisite-assets:empty': '選択されていません',
      'addasset:prerequisite-assets:explanation-text':
        '前提アセットを設定すると、開くボタンの下向き矢印から飛ぶことができるようになります',
      'addasset:supported-avatars': '対応アバター',
      'addasset:supported-avatars:placeholder': '対応アバターを選択...',
      'addasset:supported-avatars:explanation-text':
        '対応アバターは一覧で絞り込みに利用できます',
      'addasset:category': 'カテゴリ',
      'addasset:category:placeholder': 'カテゴリを選択...',
      'addasset:category:explanation-text':
        'カテゴリは1つまで選択できます (例: 衣装、髪など)',
      'addasset:tag': 'タグ',
      'addasset:tag:placeholder': 'タグを追加...',
      'addasset:tag:explanation-text':
        'タグは複数選択できます (例: Vket、無料、自作など)',
      'addasset:memo': 'メモ',
      'addasset:memo:placeholder': 'アセットに追加するメモを入力...',
      'addasset:memo:explanation-text': 'メモは情報整理や検索に利用できます',
      'addasset:additional-input': 'アセット情報の入力',
      'addasset:additional-input:explanation-text':
        'アセットの情報を入力してください！',
      'addasset:additional-input:delete-source':
        'インポート後に元ファイルを削除する',
      'addasset:select-directory': 'フォルダを選択する',
      'addasset:select-file': 'ファイルを選択する',
      'addasset:select-path': 'どちらを追加しますか？',
      'addasset:select-path:explanation-text':
        'フォルダとファイルのどちらを追加するか選択してください！',
      'addasset:select-path:drop-text':
        'ウィンドウ上にファイルかフォルダをドロップしても追加できます',
      'addasset:select-path:zip-text': 'ZIPファイルは自動で展開されます',
      'addasset:select-type': 'アセットのタイプを選択',
      'addasset:select-type:explanation-text':
        'アセットのタイプを選択してください！',
      'addasset:select-type:avatar': 'アバター素体',
      'addasset:select-type:avatar-wearable':
        'アバター関連 (服 / 髪 / アクセサリ / ギミック等)',
      'addasset:select-type:world-object': 'ワールドアセット',
      'addasset:booth-input': 'アセット情報を取得',
      'addasset:booth-input:explanation-text':
        'Boothのリンクを入力すると、自動でアセット情報が入力されます！',
      'addasset:booth-input:representative-file': 'ファイルまたはフォルダ名:',
      'addasset:booth-input:multi-import:foretext': 'と他',
      'addasset:booth-input:multi-import:posttext': 'アイテム',
      'addasset:booth-input:get-info': 'Boothから情報を取得する',
      'addasset:booth-input:button-text': '取得',
      'addasset:booth-input:manual-input': '自動取得をスキップ',
      'addasset:booth-input:failed-to-get-info': '情報取得に失敗しました',
      'addasset:booth-input:no-file-selected': 'ファイルが選択されていません！',
      'addasset:booth-edit': 'Booth情報の編集',
      'addasset:booth-edit:explanation-text':
        'Boothのリンクを編集して情報を取得するか、次のタブへ移動してください',
      'addasset:booth-edit:overwrite': 'Boothの情報で上書きする',
      'addasset:booth-edit:do-not-change': '変更しない',
      'addasset:duplicate-warning': '重複の確認',
      'addasset:duplicate-warning:explanation-text':
        '登録済みのアセットを登録しようとしていませんか？',
      'addasset:duplicate-warning:warning-text':
        '同じBoothのリンクが設定されたアセットが存在します！',
      'addasset:duplicate-warning:proceed': 'このまま進む',
      'addasset:empty-indicator': '入力して生成',
      'addasset:manual-input': 'アセット情報の入力',
      'addasset:manual-input:explanation-text':
        'アセットの情報を入力してください！',
      'addasset:manual-input:asset-name': 'アセット名',
      'addasset:manual-input:asset-name:placeholder': 'アセットの名前を入力...',
      'addasset:manual-input:shop-name': 'ショップ名',
      'addasset:manual-input:shop-name:placeholder': 'ショップの名前を入力...',
      'addasset:progress-bar:error-toast:task-id-is-null':
        'タスク ID が見つかりませんでした。',
      'addasset:progress-bar:error-toast:task-cancel-description':
        'タスクのキャンセルに失敗しました。',
      'addasset:progress-bar': 'アセットをインポートしています...',
      'addasset:progress-bar:canceling': 'キャンセル中',
      'addasset:get:error-toast': 'アセット情報の取得に失敗しました。',
      'addasset:get:error-toast:unknown-asset-type':
        '不明なアセットタイプです。',
      'addasset:get:success-toast': 'アセット情報を変更しました！',
      'addasset:update-asset': 'アセットを更新',
      'assetcard:open-button:show-dependency-warning-toast':
        '前提アセットがあります！',
      'assetcard:open-button:show-dependency-warning-toast:description':
        '開くボタンの下矢印から前提アセットを確認できます',
      'assetcard:open-button:open-dir': '管理フォルダを開く',
      'assetcard:open-button:dependency': '前提アセット',
      'assetcard:open-button:copy-path': 'パスをコピー',
      'assetcard:more-button:fail-import-toast':
        'ファイルのインポートに失敗しました',
      'assetcard:more-button:fail-import-toast:description':
        'エラーが発生しました',
      'assetcard:more-button:data-management': 'アセットのデータ管理',
      'assetcard:more-button:data-management:explanation-text':
        'データの追加や削除が行えます。高度な操作はエクスプローラーから行ってください。',
      'assetcard:more-button:data-management:add-file-or-folder':
        'ファイルかフォルダを追加する: ',
      'assetcard:more-button:data-management:explanation-text-2':
        'ウィンドウにファイルやフォルダをドロップしても新規追加できます',
      'assetcard:more-button:open-booth': 'Boothで開く',
      'assetcard:more-button:open-booth:error-text':
        'Booth URLが設定されていません！',
      'assetcard:more-button:edit-info': '情報を編集',
      'assetcard:more-button:data': 'データ管理',
      'assetcard:more-button:delete-confirm': 'アセットを本当に削除しますか？',
      'assetcard:more-button:delete-confirm:explanation-text':
        'データは完全に削除されます。この操作を取り消すことは出来ません！',
      'assetcard:select-unitypackage:select-file':
        'どのファイルを利用しますか？',
      'assetcard:select-unitypackage:always-open-dir':
        '次回から表示せず常に管理フォルダを開く',
      'assetcard:success-delete-toast': '正常に削除されました！',
      'assetcard:fail-delete-toast': '削除に失敗しました',
    },
  }

  const t = (id: string): string => {
    const value = data.data[id]

    if (value === undefined) {
      return ''
    }

    return value
  }

  return { t }
}
