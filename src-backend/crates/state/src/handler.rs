use std::{fs::File, path::PathBuf};

use crate::AppState;

pub struct StateHandler {
    path: PathBuf,
    state: AppState,
}

impl StateHandler {
    pub fn load_or_default(path: PathBuf) -> Self {
        if !path.exists() {
            return Self {
                path,
                state: AppState::default(),
            };
        }

        let file = File::open(&path);

        if let Err(e) = file {
            log::error!("Failed to open state file: {}", e);
            return Self {
                path,
                state: AppState::default(),
            };
        }

        let state: AppState = serde_json::from_reader(file.unwrap()).unwrap_or_default();
        Self { path, state }
    }

    pub fn save(&self) -> Result<(), String> {
        file::write_atomic(&self.path, |w| {
            serde_json::to_writer(w, &self.state).map_err(std::io::Error::from)
        })
        .map_err(|e| format!("Failed to write state to file: {}", e))
    }

    pub fn get_state(&self) -> &AppState {
        &self.state
    }

    pub fn set_state(&mut self, state: AppState) {
        self.state = state;
    }
}
