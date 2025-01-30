use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize, Debug, Clone, Copy, PartialEq, specta::Type)]
pub enum TaskStatus {
    Running,
    Completed,
    Cancelled,
}

#[derive(Serialize, Clone, specta::Type, tauri_specta::Event)]
pub struct TaskStatusChanged {
    id: Uuid,
    status: TaskStatus,
}

impl TaskStatusChanged {
    pub fn new(id: Uuid, status: TaskStatus) -> Self {
        Self { id, status }
    }
}
