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
        let file = File::create(&self.path);

        if let Err(e) = file {
            return Err(format!("Failed to create state file: {}", e));
        }

        let file = file.unwrap();
        if let Err(e) = serde_json::to_writer(file, &self.state) {
            return Err(format!("Failed to write state to file: {}", e));
        }

        Ok(())
    }

    pub fn get_state(&self) -> &AppState {
        &self.state
    }

    pub fn set_state(&mut self, state: AppState) {
        self.state = state;
    }
}
