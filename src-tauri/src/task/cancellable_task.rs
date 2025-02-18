use std::{future::Future, sync::Arc};

use tauri::AppHandle;
use tauri_specta::Event;
use tokio::{sync::Mutex, task::AbortHandle};
use uuid::Uuid;

use super::definitions::{TaskStatus, TaskStatusChanged};

pub struct CancellableTask {
    pub id: Uuid,
    status: Arc<Mutex<TaskStatus>>,
    error: Arc<Mutex<Option<String>>>,
    abort_handle: AbortHandle,
}

impl CancellableTask {
    fn create<F>(handle: AppHandle, task: F) -> Self
    where
        F: Future<Output = Result<(), String>> + Send + 'static,
    {
        let id = Uuid::new_v4();

        let task = tokio::spawn(task);
        let abort_handle = task.abort_handle();
        let status = Arc::new(Mutex::new(TaskStatus::Running));
        let error = Arc::new(Mutex::new(None));

        let cloned_status = Arc::clone(&status);
        let cloned_error = Arc::clone(&error);

        tokio::spawn(async move {
            let result = task.await;

            let mut status = cloned_status.lock().await;
            let mut error = cloned_error.lock().await;

            if let Ok(result) = result {
                if result.is_ok() {
                    *status = TaskStatus::Completed;
                } else {
                    *status = TaskStatus::Failed;
                    *error = Some(result.unwrap_err());
                }
            } else {
                *status = TaskStatus::Cancelled;
            };

            if let Err(e) = TaskStatusChanged::new(id, *status).emit(&handle) {
                log::error!("Failed to emit TaskStatusChanged event: {}", e);
            }
        });

        Self {
            id,
            status,
            error,
            abort_handle,
        }
    }

    pub async fn get_status(&self) -> TaskStatus {
        self.status.lock().await.clone()
    }

    pub async fn get_error(&self) -> Option<String> {
        self.error.lock().await.clone()
    }

    pub async fn abort(&mut self) -> Result<TaskStatus, String> {
        let status = self.get_status().await;

        if status != TaskStatus::Running {
            return Ok(status);
        }

        self.abort_handle.abort();

        return Ok(TaskStatus::Cancelled);
    }
}

pub struct TaskContainer {
    tasks: Vec<Arc<Mutex<CancellableTask>>>,
}

impl TaskContainer {
    pub fn new() -> Self {
        Self { tasks: vec![] }
    }

    pub fn run<F>(&mut self, app_handle: AppHandle, task: F) -> Result<Uuid, String>
    where
        F: Future<Output = Result<(), String>> + Send + 'static,
    {
        let task = CancellableTask::create(app_handle, task);

        let id = task.id;
        self.tasks.push(Arc::new(Mutex::new(task)));

        Ok(id)
    }

    pub async fn get(&mut self, id: Uuid) -> Option<Arc<Mutex<CancellableTask>>> {
        for task in &self.tasks {
            let task_clone = Arc::clone(task);
            let task = task.lock().await;
            if task.id == id {
                return Some(task_clone);
            }
        }

        None
    }
}
