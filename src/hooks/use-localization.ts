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
      // general
      'general:button:forward': '進む',
      'general:button:back': '戻る',
      'general:button:next': '次へ',
      'general:button:close': '閉じる',
      'general:button:cancel': 'キャンセル',
      'general:button:delete': '削除',
      'general:button:save': '保存',
      'general:button:open': '開く',

      'general:or': 'または',
      'general:error': 'エラー',
      'general:complete': '完了',
      'general:cancelled': 'キャンセルされました',
      'general:failed': '失敗しました',
      'general:count': '個',
      'general:clear-filter': 'フィルタをクリア',
      'general:show-all': 'すべて表示',

      'general:typeavatar': 'アバター素体',
      'general:typeavatarwearable': 'アバター関連アセット',
      'general:typeworldobject': 'ワールドアセット',

      'general:supported-avatars': '対応アバター',
      'general:category': 'カテゴリ',
      'general:tag': 'タグ',
      'general:memo': 'メモ',

      // src/components/model/asset-dialogs/AddAssetDialog/hook/index.ts
      'addasset:success-toast': 'アセットが追加されました！',
      'addasset:cancel-toast': 'キャンセルされました',
      'addasset:error-toast': 'エラー: 追加に失敗しました',
      'addasset:error-toast:description': 'エラー内容はログを参照してください',
      'addasset:import-error-toast': 'データのインポートに失敗しました',
      'addasset:import-start-error-toast':
        'データのインポートを開始できませんでした',
      // src/components/model/asset-dialogs/components/tabs/AdditionalInputTab/components/DependencyInput/index.tsx
      'addasset:prerequisite-assets': '前提アセット',
      'addasset:prerequisite-assets:empty': '選択されていません',
      'addasset:prerequisite-assets:explanation-text':
        '前提アセットを設定すると、開くボタンの下向き矢印から飛ぶことができるようになります',
      // src/components/model/asset-dialogs/components/tabs/ManualInputTab/layout/AvatarWearableLayout/index.tsx
      'addasset:supported-avatars:placeholder': '対応アバターを選択...',
      'addasset:supported-avatars:explanation-text':
        '対応アバターは一覧で絞り込みに利用できます',
      'addasset:category:placeholder': 'カテゴリを選択...',
      'addasset:category:explanation-text':
        'カテゴリは1つまで選択できます (例: 衣装、髪など)',
      'addasset:tag:placeholder': 'タグを追加...',
      'addasset:tag:explanation-text':
        'タグは複数選択できます (例: Vket、無料、自作など)',
      // src/components/model/asset-dialogs/components/tabs/AdditionalInputTab/components/MemoInput/index.tsx
      'addasset:memo:placeholder': 'アセットに追加するメモを入力...',
      'addasset:memo:explanation-text': 'メモは情報整理や検索に利用できます',
      // src/components/model/asset-dialogs/components/tabs/AdditionalInputTab/index.tsx
      'addasset:add-asset': 'アセットを追加',
      'addasset:additional-input': 'アセット情報の入力',
      'addasset:additional-input:explanation-text':
        'アセットの情報を入力してください！',
      'addasset:additional-input:delete-source':
        'インポート後に元ファイルを削除する',
      // src/components/model/asset-dialogs/components/tabs/AssetPathSelectorTab/selector/SelectDirectoryCard/index.tsx
      'addasset:select-directory': 'フォルダを選択する',
      // src/components/model/asset-dialogs/components/tabs/AssetPathSelectorTab/selector/SelectFileCard/index.tsx
      'addasset:select-file': 'ファイルを選択する',
      // src/components/model/asset-dialogs/components/tabs/AssetPathSelectorTab/index.tsx
      'addasset:select-path': 'どちらを追加しますか？',
      'addasset:select-path:explanation-text':
        'フォルダとファイルのどちらを追加するか選択してください！',
      'addasset:select-path:drop-text':
        'ウィンドウ上にファイルかフォルダをドロップしても追加できます',
      'addasset:select-path:zip-text': 'ZIPファイルは自動で展開されます',
      // src/components/model/asset-dialogs/components/tabs/AssetTypeSelector/index.tsx
      'addasset:select-type': 'アセットのタイプを選択',
      'addasset:select-type:explanation-text':
        'アセットのタイプを選択してください！',
      'addasset:select-type:avatar-wearable':
        'アバター関連 (服 / 髪 / アクセサリ / ギミック等)',
      // src/components/model/asset-dialogs/components/tabs/BoothInputTab/add/index.tsx
      'addasset:booth-input': 'アセット情報を取得',
      'addasset:booth-input:explanation-text':
        'Boothのリンクを入力すると、自動でアセット情報が入力されます！',
      'addasset:booth-input:representative-file': 'ファイルまたはフォルダ名:',
      'addasset:booth-input:multi-import:foretext': 'と他',
      'addasset:booth-input:multi-import:posttext': 'アイテム',
      'addasset:booth-input:get-info': 'Boothから情報を取得する',
      'addasset:booth-input:button-text': '取得',
      'addasset:booth-input:manual-input': '自動取得をスキップ',
      // src/components/model/asset-dialogs/components/tabs/BoothInputTab/add/hook/index.ts
      // src/components/model/asset-dialogs/components/tabs/BoothInputTab/edit/hook/index.ts
      'addasset:booth-input:failed-to-get-info': '情報取得に失敗しました',
      'addasset:booth-input:no-file-selected': 'ファイルが選択されていません！',
      // src/components/model/asset-dialogs/components/tabs/BoothInputTab/edit/index.tsx
      'addasset:booth-edit': 'Booth情報の編集',
      'addasset:booth-edit:explanation-text':
        'Boothのリンクを編集して情報を取得するか、次のタブへ移動してください',
      'addasset:booth-edit:overwrite': 'Boothの情報で上書きする',
      'addasset:booth-edit:do-not-change': '変更しない',
      // src/components/model/asset-dialogs/components/tabs/DuplicateWarningTab/index.tsx
      'addasset:duplicate-warning': '重複の確認',
      'addasset:duplicate-warning:explanation-text':
        '登録済みのアセットを登録しようとしていませんか？',
      'addasset:duplicate-warning:warning-text':
        '同じBoothのリンクが設定されたアセットが存在します！',
      'addasset:duplicate-warning:proceed': 'このまま進む',
      // src/components/model/asset-dialogs/components/tabs/ManualInputTab/layout/WorldObjectLayout/index.tsx
      // src/components/model/asset-dialogs/components/tabs/ManualInputTab/layout/AvatarWearableLayout/index.tsx
      // src/components/model/asset-dialogs/components/tabs/ManualInputTab/layout/AvatarLayout/index.tsx
      'addasset:empty-indicator': '入力して生成',
      'addasset:manual-input': 'アセット情報の入力',
      'addasset:manual-input:explanation-text':
        'アセットの情報を入力してください！',
      'addasset:manual-input:asset-name': 'アセット名',
      'addasset:manual-input:asset-name:placeholder': 'アセットの名前を入力...',
      'addasset:manual-input:shop-name': 'ショップ名',
      'addasset:manual-input:shop-name:placeholder': 'ショップの名前を入力...',
      // src/components/model/asset-dialogs/components/tabs/ProgressTab/hook/index.ts
      'addasset:progress-bar:error-toast:task-id-is-null':
        'タスク ID が見つかりませんでした。',
      'addasset:progress-bar:error-toast:task-cancel-description':
        'タスクのキャンセルに失敗しました。',
      // src/components/model/asset-dialogs/components/tabs/ProgressTab/index.tsx
      'addasset:progress-bar': 'アセットをインポートしています...',
      'addasset:progress-bar:canceling': 'キャンセル中',
      // src/components/model/asset-dialogs/EditAssetDialog/hook/index.tsx
      'addasset:get:error-toast': 'アセット情報の取得に失敗しました。',
      'addasset:get:error-toast:unknown-asset-type':
        '不明なアセットタイプです。',
      'addasset:get:success-toast': 'アセット情報を変更しました！',
      // src/components/model/asset-dialogs/EditAssetDialog/index.tsx
      'addasset:update-asset': 'アセットを更新',


      // src/components/model/AssetCard/components/AssetCardOpenButton/hook.tsx
      'assetcard:open-button:show-dependency-warning-toast':
        '前提アセットがあります！',
      'assetcard:open-button:show-dependency-warning-toast:description':
        '開くボタンの下矢印から前提アセットを確認できます',
      // src/components/model/AssetCard/components/AssetCardOpenButton/index.tsx
      // src/components/model/AssetCard/components/SelectUnitypackageDialog/index.tsx
      'assetcard:open-button:open-dir': '管理フォルダを開く',
      'assetcard:open-button:dependency': '前提アセット',
      'assetcard:open-button:copy-path': 'パスをコピー',
      // src/components/model/AssetCard/components/MoreButton/components/DataManagementDialog/components/OngoingImportRow/index.tsx
      'assetcard:more-button:fail-import-toast':
        'ファイルのインポートに失敗しました',
      'assetcard:more-button:fail-import-toast:description':
        'エラーが発生しました',
      // src/components/model/AssetCard/components/MoreButton/components/DataManagementDialog/index.tsx
      'assetcard:more-button:data-management': 'アセットのデータ管理',
      'assetcard:more-button:data-management:explanation-text':
        'データの追加や削除が行えます。高度な操作はエクスプローラーから行ってください。',
      'assetcard:more-button:data-management:add-file-or-folder':
        'ファイルかフォルダを追加する: ',
      'assetcard:more-button:data-management:explanation-text-2':
        'ウィンドウにファイルやフォルダをドロップしても新規追加できます',
      // src/components/model/AssetCard/components/MoreButton/index.tsx
      'assetcard:more-button:open-booth': 'Boothで開く',
      'assetcard:more-button:open-booth:error-text':
        'Booth URLが設定されていません！',
      'assetcard:more-button:edit-info': '情報を編集',
      'assetcard:more-button:data': 'データ管理',
      'assetcard:more-button:delete-confirm': 'アセットを本当に削除しますか？',
      'assetcard:more-button:delete-confirm:explanation-text':
        'データは完全に削除されます。この操作を取り消すことは出来ません！',
      // src/components/model/AssetCard/components/SelectUnitypackageDialog/index.tsx
      'assetcard:select-unitypackage:select-file':
        'どのファイルを利用しますか？',
      'assetcard:select-unitypackage:always-open-dir':
        '次回から表示せず常に管理フォルダを開く',
      // src/components/model/AssetCard/hook/index.ts
      'assetcard:success-delete-toast': '正常に削除されました！',
      'assetcard:fail-delete-toast': '削除に失敗しました',


      // src/components/model/AssetList/components/AssetListBackground/index.tsx
      'assetlist:background:no-assets': 'アセットが1つも登録されていません',
      'assetlist:background:add-asset': 'アセットを登録する',
      'assetlist:background:no-results': 'フィルタ条件を満たすアセットがありません',


      // src/components/model/AssetSelector/index.tsx
      'assetselector:search-placeholder': '前提アセットを検索...',


      // src/components/model/DependencyDialog/index.tsx
      'dependencydialog:header': '前提アセット一覧',

      // src/components/model/MainNavBar/index.tsx
      'mainnavbar:total-asset-count': '個のアセットのうち',
      'mainnavbar:showing': 'を表示中',
      'mainnavbar:sort-settings': 'ソート設定',
      'mainnavbar:sort-settings:created-at-desc': '追加順 (新しいものから)',
      'mainnavbar:sort-settings:created-at-asc': '追加順 (古いものから)',
      'mainnavbar:sort-settings:asset-name-asc': 'アセット名 (A-Z順)',
      'mainnavbar:sort-settings:asset-name-desc': 'アセット名 (Z-A順)',
      'mainnavbar:sort-settings:shop-name-asc': 'ショップ名 (A-Z順)',
      'mainnavbar:sort-settings:shop-name-desc': 'ショップ名 (Z-A順)',
      'mainnavbar:sort-settings:published-at-desc': '商品公開日 (新しいものから)',
      'mainnavbar:sort-settings:published-at-asc': '商品公開日 (古いものから)',

      // src/componments/model/MainSideBar/components/MultiFilterItemSelector/index.tsx
      'mainsidebar:multi-filter-item-selector:placeholder': 'アイテムを選択...',
      'mainsidebar:multi-filter-item-selector:no-candidates': '候補がありません',
      // src\components\model\MainSidebar\components\TextSearch
      'mainsidebar:text-search': 'テキストで検索',
      'mainsidebar:advanced-search': '詳細',
      // src\components\model\MainSidebar\components\TextSearch\components\AdvancedTextSearch\index.tsx
      'mainsidebar:advanced-search:asset-name': 'アセット名',
      'mainsidebar:advanced-search:asset-name:placeholder': 'アセット名を入力...',
      'mainsidebar:advanced-search:shop-name': 'ショップ名',
      'mainsidebar:advanced-search:shop-name:placeholder': 'ショップ名を入力...',
      // src\components\model\MainSidebar\components\TextSearch\components\GeneralTextSearch\index.tsx
      'mainsidebar:general-search:placeholder': 'キーワードを入力...',
      // src\components\model\MainSidebar\layout\AvatarWearableFilter\index.tsx
      'mainsidebar:avatar-wearable-filter:supported-avatars:placeholder': '対応アバターを選択...',
      // src\components\model\MainSidebar\index.tsx
      'mainsidebar:asset-type': 'アセットタイプ',
      'mainsidebar:filter:category:placeholder': 'カテゴリを選択...',
      'mainsidebar:filter:tag:placeholder': 'タグを選択...',

      // src\components\model\ResetDialog\index.tsx
      'resetdialog:reset': '初期化する',
      'resetdialog:reset-confirm': '本当に初期化しますか？',
      'resetdialog:reset-confirm:explanation-text-1':
        'この操作は取り消せないため、慎重に行ってください。',
      'resetdialog:reset-confirm:explanation-text-2': '削除を実行すると、アプリケーションは自動で再起動します。',
      'resetdialog:reset:select-items': '削除する項目',
      'resetdialog:reset:select-items:appdata': 'アプリデータ',
      'resetdialog:reset:select-items:appdata:subtext': '設定ファイル',
      'resetdialog:reset:select-items:metadata': 'メタデータ',
      'resetdialog:reset:select-items:metadata:subtext': 'アセット情報',
      'resetdialog:reset:select-items:assetdata': 'アセットデータ',
      'resetdialog:reset:select-items:assetdata:subtext': 'アセットデータ本体',
      'resetdialog:reset-confirm:checkbox-text': '私は削除後のデータが元に戻せないことを理解しています',
      'resetdialog:button:delete': '削除する',

      //src\components\model\SlimAssetDetail\index.tsx
      'slimassetdetail:edit-info': '情報を編集',


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
