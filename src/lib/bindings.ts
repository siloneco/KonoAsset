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
async getSortedAssetsForDisplay(sortBy: SortBy) : Promise<Result<AssetSummary[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_sorted_assets_for_display", { sortBy }) };
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
async requestAvatarImport(request: AvatarImportRequest) : Promise<Result<Avatar, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_avatar_import", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestAvatarWearableImport(request: AvatarWearableImportRequest) : Promise<Result<AvatarWearable, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_avatar_wearable_import", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestWorldObjectImport(request: WorldObjectImportRequest) : Promise<Result<WorldObject, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_world_object_import", { request }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async requestAssetDeletion(id: string) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("request_asset_deletion", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async updateAvatar(asset: Avatar) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("update_avatar", { asset }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async updateAvatarWearable(asset: AvatarWearable) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("update_avatar_wearable", { asset }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async updateWorldObject(asset: WorldObject) : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("update_world_object", { asset }) };
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
async getAllAssetTags() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_asset_tags") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAllSupportedAvatarValues() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_all_supported_avatar_values") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAvatarWearableCategories() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_avatar_wearable_categories") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAvatarWearableSupportedAvatars() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_avatar_wearable_supported_avatars") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getWorldObjectCategories() : Promise<Result<string[], string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_world_object_categories") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getAssetDescriptionFromBooth(boothItemId: number) : Promise<Result<BoothInfo, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("get_asset_description_from_booth", { boothItemId }) };
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
async executeUpdate() : Promise<Result<boolean, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("execute_update") };
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
async copyImageFileToImages(path: string, temporary: boolean) : Promise<Result<string, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("copy_image_file_to_images", { path, temporary }) };
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
async listUnitypackageFiles(id: string) : Promise<Result<{ [key in string]: FileInfo[] }, string>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("list_unitypackage_files", { id }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async migrateDataDir(newPath: string, migrateData: boolean) : Promise<Result<null, string>> {
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
}
}

/** user-defined events **/



/** user-defined constants **/



/** user-defined types **/

export type AssetDescription = { name: string; creator: string; imageFilename: string | null; tags: string[]; boothItemId: number | null; createdAt: number; publishedAt: number | null }
export type AssetSummary = { id: string; assetType: AssetType; name: string; creator: string; imageFilename: string | null; boothItemId: number | null; publishedAt: number | null }
export type AssetType = "Avatar" | "AvatarWearable" | "WorldObject"
export type Avatar = { id: string; description: AssetDescription }
export type AvatarImportRequest = { preAsset: PreAvatar; absolutePath: string; deleteSource: boolean }
export type AvatarWearable = { id: string; description: AssetDescription; category: string; supportedAvatars: string[] }
export type AvatarWearableImportRequest = { preAsset: PreAvatarWearable; absolutePath: string; deleteSource: boolean }
export type BoothInfo = { description: AssetDescription; estimatedAssetType: AssetType | null }
export type FileInfo = { fileName: string; absolutePath: string }
export type FilterRequest = { assetType: AssetType | null; text: string | null; categories: string[] | null; tags: string[] | null; tagMatchType: MatchType; supportedAvatars: string[] | null; supportedAvatarMatchType: MatchType }
export type GetAssetResult = { assetType: AssetType; avatar: Avatar | null; avatarWearable: AvatarWearable | null; worldObject: WorldObject | null }
export type LoadResult = { success: boolean; preferenceLoaded: boolean; message: string | null }
export type MatchType = "AND" | "OR"
export type PreAvatar = { description: AssetDescription }
export type PreAvatarWearable = { description: AssetDescription; category: string; supportedAvatars: string[] }
export type PreWorldObject = { description: AssetDescription; category: string }
export type PreferenceStore = { dataDirPath: string; theme: Theme; deleteOnImport: boolean; useUnitypackageSelectedOpen: boolean }
export type ResetApplicationRequest = { resetPreferences: boolean; deleteMetadata: boolean; deleteAssetData: boolean }
export type SortBy = "Name" | "Creator" | "CreatedAt" | "PublishedAt"
export type Theme = "light" | "dark" | "system"
export type WorldObject = { id: string; description: AssetDescription; category: string }
export type WorldObjectImportRequest = { preAsset: PreWorldObject; absolutePath: string; deleteSource: boolean }

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
