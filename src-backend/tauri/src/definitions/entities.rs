use std::path::PathBuf;

use model::{Avatar, AvatarWearable, OtherAsset, WorldObject};
use serde::{Deserialize, Serialize};
use tauri_specta::Event;

#[derive(Serialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct LoadResult {
    success: bool,
    preference_loaded: bool,
    message: Option<String>,
}

impl LoadResult {
    pub fn success() -> Self {
        Self {
            success: true,
            preference_loaded: true,
            message: None,
        }
    }

    pub fn error(preference_loaded: bool, message: String) -> Self {
        Self {
            success: false,
            preference_loaded,
            message: Some(message),
        }
    }
}

#[derive(Serialize, Clone, specta::Type, Event)]
#[serde(rename_all = "camelCase")]
pub struct ProgressEvent {
    pub percentage: f32,
    pub filename: String,
}

impl ProgressEvent {
    pub fn new(percentage: f32, filename: String) -> Self {
        Self {
            percentage,
            filename,
        }
    }
}

#[derive(specta::Type)]
pub struct InitialSetup {
    pub require_initial_setup: bool,
    pub preference_file: PathBuf,
}

impl InitialSetup {
    pub fn new(preference_file: PathBuf) -> Self {
        Self {
            require_initial_setup: !preference_file.exists(),
            preference_file,
        }
    }

    pub fn update(&mut self) {
        self.require_initial_setup = !self.preference_file.exists();
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum AssetUpdatePayload {
    Avatar(Avatar),
    AvatarWearable(AvatarWearable),
    WorldObject(WorldObject),
    OtherAsset(OtherAsset),
}
