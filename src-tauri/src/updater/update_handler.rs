use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Url};
use tauri_plugin_updater::{Update, UpdaterExt};
use tauri_specta::Event;

pub struct UpdateHandler {
    app_handle: AppHandle,
    initialized: bool,
    update_available: bool,
    downloaded_update_data: Option<Vec<u8>>,
    update_version: Option<String>,
    update_handler: Option<Update>,
    show_notification: bool,
}

#[derive(Serialize, Debug, Clone, Copy, specta::Type, tauri_specta::Event)]
pub struct UpdateProgress {
    pub progress: f32,
}

impl UpdateProgress {
    pub fn new(progress: f32) -> Self {
        Self { progress }
    }
}

impl UpdateHandler {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            app_handle,
            initialized: false,
            update_available: false,
            downloaded_update_data: None,
            update_version: None,
            update_handler: None,
            show_notification: true,
        }
    }

    pub async fn check_for_update(
        &mut self,
        channel: &UpdateChannel,
    ) -> tauri_plugin_updater::Result<bool> {
        let url = format!(
            "https://releases.konoasset.dev/manifests/{}.json",
            channel.as_str()
        );

        log::info!("checking for update from {}", url);

        let result = self
            .app_handle
            .updater_builder()
            .endpoints(vec![Url::parse(&url).unwrap()])?
            .build()?
            .check()
            .await?;

        self.update_handler = result.clone();

        if let Some(update) = result {
            self.update_available = true;
            self.update_version = Some(update.version);

            self.initialized = true;
            return Ok(true);
        } else {
            self.update_available = false;
            self.update_version = None;

            self.initialized = true;
            return Ok(false);
        }
    }

    pub async fn download_update(&mut self) -> tauri_plugin_updater::Result<()> {
        if let Some(update) = &self.update_handler {
            let mut downloaded = 0;

            let downloaded_data = update
                .download(
                    |chunk_length, content_length| {
                        downloaded += chunk_length;

                        let progress = if let Some(len) = content_length {
                            downloaded as f32 / len as f32
                        } else {
                            0f32
                        };

                        log::debug!("downloaded {downloaded} bytes ({:.1}%)", progress * 100.0);

                        if let Err(e) = UpdateProgress::new(progress).emit(&self.app_handle) {
                            log::error!("failed to emit update progress: {:?}", e);
                        }
                    },
                    || {
                        log::info!("update download completed");
                        if let Err(e) = UpdateProgress::new(100f32).emit(&self.app_handle) {
                            log::error!("failed to emit update progress: {:?}", e);
                        }
                    },
                )
                .await?;

            self.downloaded_update_data = Some(downloaded_data);
        }

        Ok(())
    }

    pub fn install_update(&self) -> Result<(), String> {
        if self.update_handler.is_none() {
            return Err("No update available".to_string());
        }
        if self.downloaded_update_data.is_none() {
            return Err("No update downloaded".to_string());
        }

        let update = self.update_handler.as_ref().unwrap();
        let data = self.downloaded_update_data.as_ref().unwrap();

        update
            .install(&data)
            .map_err(|e| format!("Failed to install update: {:?}", e))?;

        Ok(())
    }

    pub fn is_initialized(&self) -> bool {
        self.initialized
    }

    pub fn update_available(&self) -> bool {
        self.update_available
    }

    // pub fn update_version(&self) -> Option<&str> {
    //     self.update_version.as_deref()
    // }

    pub async fn show_notification(&self) -> bool {
        self.show_notification
    }

    pub async fn set_show_notification(&mut self, show_notification: bool) {
        self.show_notification = show_notification;
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, specta::Type)]
pub enum UpdateChannel {
    Stable,
    PreRelease,
}

impl UpdateChannel {
    pub fn as_str(&self) -> &str {
        match self {
            UpdateChannel::Stable => "stable",
            UpdateChannel::PreRelease => "pre-release",
        }
    }
}
