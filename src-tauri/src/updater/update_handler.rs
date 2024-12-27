use tauri::{async_runtime::Mutex, AppHandle};
use tauri_plugin_updater::{Update, UpdaterExt};

pub struct UpdateHandler {
    app_handle: AppHandle,
    initialized: bool,
    update_available: bool,
    update_version: Option<String>,
    update_handler: Option<Update>,
    show_notification: Mutex<bool>,
}

impl UpdateHandler {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            app_handle,
            initialized: false,
            update_available: false,
            update_version: None,
            update_handler: None,
            show_notification: Mutex::new(true),
        }
    }

    pub async fn check_for_update(&mut self) -> tauri_plugin_updater::Result<bool> {
        let result = self.app_handle.updater()?.check().await?;

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

    pub async fn execute_update(&self) -> tauri_plugin_updater::Result<()> {
        if let Some(update) = &self.update_handler {
            let mut downloaded = 0;

            update
                .download_and_install(
                    |chunk_length, content_length| {
                        downloaded += chunk_length;
                        println!("downloaded {downloaded} from {content_length:?}");
                    },
                    || {
                        println!("download finished");
                    },
                )
                .await?;

            println!("update installed");
            self.app_handle.restart();
        }

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
        *self.show_notification.lock().await
    }

    pub async fn set_show_notification(&self, show_notification: bool) {
        *self.show_notification.lock().await = show_notification;
    }
}
