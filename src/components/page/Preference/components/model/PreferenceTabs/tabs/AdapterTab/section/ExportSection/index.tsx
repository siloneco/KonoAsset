import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FolderOutput } from 'lucide-react'
import { FC } from 'react'
import { Input } from '@/components/ui/input'
import {
  ExportTypeButton,
  ExportTypeButtonDescription,
  ExportTypeButtonTitle,
} from '../../components/ExportTypeButton'
import { useExportSection } from './hook'
import { TaskStatusHandler } from '@/components/model/TaskStatusHandler'

export const ExportSection: FC = () => {
  const {
    currentExportType,
    exportButtonActivated,
    exportDestination,
    selectExportDestination,
    setExportType,
    startExport,
    taskId,
    onCompleted,
    onCancelled,
    onFailed,
  } = useExportSection()

  return (
    <div className="pb-12">
      <Label className="text-xl flex flex-row items-center">
        エクスポート
        <FolderOutput className="text-foreground/50 ml-2" />
      </Label>
      <p className="mt-1 text-sm text-muted-foreground">
        登録されているデータを形式を指定して出力します
      </p>
      <div className="mt-6 w-full flex flex-col items-center">
        <div className="w-4/5 max-w-[800px] space-y-6">
          <div className="space-y-2">
            <Label className="text-base">出力形式を選択</Label>
            <ExportTypeButton
              active={currentExportType === 'KonoAsset'}
              onClick={() => setExportType('KonoAsset')}
            >
              <ExportTypeButtonTitle>
                KonoAssetや他アプリへのデータ移行のため
              </ExportTypeButtonTitle>
              <ExportTypeButtonDescription>
                KonoAssetで使用される形式で出力します
                <br />
                データはKonoAssetや対応する他アプリにインポートすることができます
              </ExportTypeButtonDescription>
            </ExportTypeButton>
            <ExportTypeButton
              active={currentExportType === 'HumanReadable'}
              onClick={() => setExportType('HumanReadable')}
            >
              <ExportTypeButtonTitle>
                エクスプローラー等で表示するため
              </ExportTypeButtonTitle>
              <ExportTypeButtonDescription>
                フォルダ名などを分かりやすい形式に整理して出力します
              </ExportTypeButtonDescription>
            </ExportTypeButton>
          </div>
          <div className="space-y-2">
            <Label className="text-base">出力先を選択</Label>
            <div className="flex flex-row">
              <Input
                className="mr-2"
                placeholder="出力先を選択してください"
                value={exportDestination ?? ''}
                disabled
              />
              <Button variant="secondary" onClick={selectExportDestination}>
                選択
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 w-full flex justify-center">
          <Button
            className="w-1/4"
            onClick={startExport}
            disabled={!exportButtonActivated}
          >
            出力する
          </Button>
        </div>
      </div>
      <TaskStatusHandler
        taskId={taskId}
        title="エクスポート中..."
        description="データをエクスポートしています..."
        cancelButtonText="キャンセル"
        onCompleted={onCompleted}
        onCancelled={onCancelled}
        onFailed={onFailed}
      />
    </div>
  )
}
