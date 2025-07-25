/* eslint-disable */
// @ts-nocheck
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

/** user-defined commands **/


export const commands = {
async getAsset(id: string) : Promise<Result<GetAssetResult, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_asset", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getSortedAssetSummaries(sortBy: SortBy) : Promise<Result<AssetSummary[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_sorted_asset_summaries", { sortBy }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAssetDisplaysByBoothId(boothItemId: number) : Promise<Result<AssetSummary[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_asset_displays_by_booth_id", { boothItemId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestAvatarImport(request: AssetImportRequest<PreAvatar>) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_avatar_import", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestAvatarWearableImport(request: AssetImportRequest<PreAvatarWearable>) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_avatar_wearable_import", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestWorldObjectImport(request: AssetImportRequest<PreWorldObject>) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_world_object_import", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestOtherAssetImport(request: AssetImportRequest<PreOtherAsset>) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_other_asset_import", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestAssetDeletion(id: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_asset_deletion", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async updateAsset(payload: AssetUpdatePayload) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("update_asset", { payload }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getFilteredAssetIds(request: FilterRequest) : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_filtered_asset_ids", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getLoadStatus() : Promise<LoadResult> {
    return await TAURI_INVOKE("get_load_status");
},
async importFromOtherDataStore(path: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("import_from_other_data_store", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async exportAsKonoassetZip(path: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("export_as_konoasset_zip", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async exportAsHumanReadableZip(path: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("export_as_human_readable_zip", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async exportForAvatarExplorer(path: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("export_for_avatar_explorer", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getRegistrationStatistics() : Promise<Result<AssetRegistrationStatistics[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_registration_statistics") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async executeVolumeStatisticsCalculationTask() : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("execute_volume_statistics_calculation_task") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getVolumeStatisticsCache() : Promise<Result<AssetVolumeStatistics[] | null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_volume_statistics_cache") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getCreatorNames(allowedIds: string[] | null) : Promise<Result<PrioritizedEntry[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_creator_names", { allowedIds }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllAssetTags(allowedIds: string[] | null) : Promise<Result<PrioritizedEntry[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_asset_tags", { allowedIds }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAvatarWearableCategories(allowedIds: string[] | null) : Promise<Result<PrioritizedEntry[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_avatar_wearable_categories", { allowedIds }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAvatarWearableSupportedAvatars(allowedIds: string[] | null) : Promise<Result<PrioritizedEntry[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_avatar_wearable_supported_avatars", { allowedIds }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getWorldObjectCategories(allowedIds: string[] | null) : Promise<Result<PrioritizedEntry[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_world_object_categories", { allowedIds }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getOtherAssetCategories(allowedIds: string[] | null) : Promise<Result<PrioritizedEntry[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_other_asset_categories", { allowedIds }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAssetInfoFromBooth(boothItemId: number) : Promise<Result<BoothAssetInfo, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_asset_info_from_booth", { boothItemId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async resolvePximgFilename(url: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("resolve_pximg_filename", { url }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getBoothUrl(id: number) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_booth_url", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async checkForUpdate() : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("check_for_update") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async downloadUpdate() : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("download_update") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async installUpdate() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("install_update") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async doNotNotifyUpdate() : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("do_not_notify_update") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getChangelog() : Promise<Result<LocalizedChanges[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_changelog") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openFileInFileManager(path: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_file_in_file_manager", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openAppDir() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_app_dir") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openDataDir() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_data_dir") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openMetadataDir() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_metadata_dir") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openAssetDataDir() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_asset_data_dir") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openManagedDir(id: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_managed_dir", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openLogsDir() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("open_logs_dir") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async importFileEntriesToAsset(assetId: string, paths: string[]) : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("import_file_entries_to_asset", { assetId, paths }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async copyImageFileToImages(path: string, temporary: boolean) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("copy_image_file_to_images", { path, temporary }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async listAssetDirEntry(id: string) : Promise<Result<SimplifiedDirEntry[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("list_asset_dir_entry", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async deleteEntryFromAssetDataDir(assetId: string, entryName: string) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("delete_entry_from_asset_data_dir", { assetId, entryName }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getDirectoryPath(id: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_directory_path", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async listUnitypackageFiles(id: string) : Promise<Result<Partial<{ [key in string]: FileInfo[] }>, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("list_unitypackage_files", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async migrateDataDir(newPath: string, migrateData: boolean) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("migrate_data_dir", { newPath, migrateData }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getImageAbsolutePath(filename: string) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_image_absolute_path", { filename }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async extractNonExistentPaths(paths: string[]) : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("extract_non_existent_paths", { paths }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requireInitialSetup() : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("require_initial_setup") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getPreferences() : Promise<Result<PreferenceStore, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_preferences") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async setPreferences(newPreference: PreferenceStore) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("set_preferences", { newPreference }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async resetApplication(request: ResetApplicationRequest) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("reset_application", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getLogs() : Promise<LogEntry[]> {
    return await TAURI_INVOKE("get_logs");
},
async getTaskStatus(id: string) : Promise<Result<TaskStatus, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_task_status", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async cancelTaskRequest(id: string) : Promise<Result<TaskStatus, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("cancel_task_request", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getTaskError(id: string) : Promise<Result<string | null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_task_error", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getCurrentLanguageData() : Promise<Result<LocalizationData, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_current_language_data") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async loadLanguageFile(path: string, fallbackKeys: string[]) : Promise<Result<CustomLanguageFileLoadResult, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("load_language_file", { path, fallbackKeys }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestStartupDeepLinkExecution() : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_startup_deep_link_execution") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAppState() : Promise<Result<AppState, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_app_state") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async saveAppState(state: AppState) : Promise<Result<null, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("save_app_state", { state }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
}
}

/** user-defined events **/


export const events = __makeEvents__<{
addAssetDeepLink: AddAssetDeepLink,
assetVolumeEstimatedEvent: AssetVolumeEstimatedEvent,
progressEvent: ProgressEvent,
taskStatusChanged: TaskStatusChanged,
updateProgress: UpdateProgress
}>({
addAssetDeepLink: "add-asset-deep-link",
assetVolumeEstimatedEvent: "asset-volume-estimated-event",
progressEvent: "progress-event",
taskStatusChanged: "task-status-changed",
updateProgress: "update-progress"
})

/** user-defined constants **/



/** user-defined types **/

export type AddAssetDeepLink = { path: string[]; boothItemId: number | null }
export type AppState = { sort?: SortState; displayStyle: DisplayStyle }
export type AssetDescription = { name: string; creator: string; imageFilename: string | null; tags: string[]; memo: string | null; boothItemId: number | null; dependencies: string[]; createdAt: number; publishedAt: number | null }
export type AssetImportRequest<T> = { preAsset: T; absolutePaths: string[]; deleteSource: boolean }
export type AssetRegistrationStatistics = { date: string; avatars: number; avatarWearables: number; worldObjects: number; otherAssets: number }
export type AssetSummary = { id: string; assetType: AssetType; name: string; creator: string; imageFilename: string | null; hasMemo: boolean; dependencies: string[]; boothItemId: number | null; publishedAt: number | null }
export type AssetType = "Avatar" | "AvatarWearable" | "WorldObject" | "OtherAsset"
export type AssetUpdatePayload = { avatar: Avatar } | { avatarWearable: AvatarWearable } | { worldObject: WorldObject } | { otherAsset: OtherAsset }
export type AssetVolumeEstimatedEvent = { type: AssetVolumeEstimatedEventType; data: AssetVolumeStatistics[] }
export type AssetVolumeEstimatedEventType = "Chunk" | "Completed"
export type AssetVolumeStatistics = { id: string; assetType: AssetType; name: string; sizeInBytes: number }
export type Avatar = { id: string; description: AssetDescription }
export type AvatarWearable = { id: string; description: AssetDescription; category: string; supportedAvatars: string[] }
export type BoothAssetInfo = { id: number; name: string; creator: string; imageUrls: string[]; publishedAt: number; estimatedAssetType: AssetType | null }
export type CustomLanguageFileLoadResult = { data: LocalizationData; missing_keys: string[]; additional_keys: string[] }
export type DisplayStyle = "GridSmall" | "GridMedium" | "GridLarge" | "List"
export type EntryType = "directory" | "file"
export type FileInfo = { fileName: string; absolutePath: string }
export type FilterRequest = { assetType: AssetType | null; queryText: string | null; categories: string[] | null; tags: string[] | null; tagMatchType: MatchType; supportedAvatars: string[] | null; supportedAvatarMatchType: MatchType }
export type GetAssetResult = { assetType: AssetType; avatar: Avatar | null; avatarWearable: AvatarWearable | null; worldObject: WorldObject | null; otherAsset: OtherAsset | null }
export type LanguageCode = "ja-JP" | "en-US" | "en-GB" | "zh-CN" | { "user-provided": string }
export type LoadResult = { success: boolean; preferenceLoaded: boolean; message: string | null }
export type LocalizationData = { language: LanguageCode; data: Partial<{ [key in string]: string }> }
export type LocalizedChanges = { version: string; pre_release: boolean; features: string[]; fixes: string[]; others: string[] }
export type LogEntry = { time: string; level: LogLevel; target: string; message: string }
export type LogLevel = "Error" | "Warn" | "Info" | "Debug" | "Trace"
export type MatchType = "AND" | "OR"
export type OtherAsset = { id: string; description: AssetDescription; category: string }
export type PreAvatar = { description: AssetDescription }
export type PreAvatarWearable = { description: AssetDescription; category: string; supportedAvatars: string[] }
export type PreOtherAsset = { description: AssetDescription; category: string }
export type PreWorldObject = { description: AssetDescription; category: string }
export type PreferenceStore = { dataDirPath: string; theme: Theme; language: LanguageCode; deleteOnImport: boolean; zipExtraction: boolean; useUnitypackageSelectedOpen: boolean; updateChannel: UpdateChannel }
export type PrioritizedEntry = { priority: number; value: string }
export type ProgressEvent = { percentage: number; filename: string }
export type ResetApplicationRequest = { resetPreferences: boolean; deleteMetadata: boolean; deleteAssetData: boolean }
export type SimplifiedDirEntry = { entryType: EntryType; name: string; absolutePath: string }
export type SortBy = "Name" | "Creator" | "CreatedAt" | "PublishedAt"
export type SortState = { sortBy: SortBy; reversed: boolean }
export type TaskStatus = "Running" | "Completed" | "Cancelled" | "Failed"
export type TaskStatusChanged = { id: string; status: TaskStatus }
export type Theme = "light" | "dark" | "system"
export type UpdateChannel = "Stable" | "PreRelease"
export type UpdateProgress = { progress: number }
export type WorldObject = { id: string; description: AssetDescription; category: string }

/** tauri-specta globals **/

import {
	invoke as TAURI_INVOKE,
	Channel as TAURI_CHANNEL,
} from "@tauri-apps/api/core";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindow as __WebviewWindow__ } from "@tauri-apps/api/webviewWindow";

type __EventObj__<T> = {
	listen: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
	once: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
	emit: null extends T
		? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
		: (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

export type Result<T, E> =
	| { status: "ok"; data: T }
	| { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
	mappings: Record<keyof T, string>,
) {
	return new Proxy(
		{} as unknown as {
			[K in keyof T]: __EventObj__<T[K]> & {
				(handle: __WebviewWindow__): __EventObj__<T[K]>;
			};
		},
		{
			get: (_, event) => {
				const name = mappings[event as keyof T];

				return new Proxy((() => {}) as any, {
					apply: (_, __, [window]: [__WebviewWindow__]) => ({
						listen: (arg: any) => window.listen(name, arg),
						once: (arg: any) => window.once(name, arg),
						emit: (arg: any) => window.emit(name, arg),
					}),
					get: (_, command: keyof __EventObj__<any>) => {
						switch (command) {
							case "listen":
								return (arg: any) => TAURI_API_EVENT.listen(name, arg);
							case "once":
								return (arg: any) => TAURI_API_EVENT.once(name, arg);
							case "emit":
								return (arg: any) => TAURI_API_EVENT.emit(name, arg);
						}
					},
				});
			},
		},
	);
}
