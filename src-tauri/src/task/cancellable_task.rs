use std::{future::Future, sync::Arc};

use tauri::AppHandle;
use tauri_specta::Event;
use tokio::{sync::Mutex, task::AbortHandle};
use uuid::Uuid;

use super::definitions::{TaskStatus, TaskStatusChanged};

pub struct CancellableTask {
    pub id: Uuid,
    status: Arc<Mutex<TaskStatus>>,
    abort_handle: AbortHandle,
}

impl CancellableTask {
    fn create<F>(handle: AppHandle, task: F) -> Self
    where
        F: Future<Output = ()> + Send + 'static,
    {
        let id = Uuid::new_v4();

        let task = tokio::spawn(task);
        let abort_handle = task.abort_handle();
        let status = Arc::new(Mutex::new(TaskStatus::Running));
        let cloned_status = Arc::clone(&status);

        tokio::spawn(async move {
            let result = task.await;

            let mut status = cloned_status.lock().await;
            *status = if result.is_ok() {
                TaskStatus::Completed
            } else {
                TaskStatus::Cancelled
            };

            if let Err(e) = TaskStatusChanged::new(id, *status).emit(&handle) {
                log::error!("Failed to emit TaskStatusChanged event: {}", e);
            }
        });

        Self {
            id,
            status,
            abort_handle,
        }
    }

    pub async fn get_status(&self) -> TaskStatus {
        self.status.lock().await.clone()
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
        F: Future<Output = ()> + Send + 'static,
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
