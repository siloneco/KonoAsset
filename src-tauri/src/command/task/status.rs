use std::sync::Arc;

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::task::{cancellable_task::TaskContainer, definitions::TaskStatus};

#[tauri::command]
#[specta::specta]
pub async fn get_task_status(
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    id: Uuid,
) -> Result<TaskStatus, String> {
    let mut container = task_container.lock().await;
    let task = container.get(id).await;

    match task {
        Some(task) => {
            let task = task.lock().await;
            let status = task.get_status().await;
            Ok(status)
        }
        None => {
            log::error!("Task not found: {:?}", id);
            Err("Task not found.".into())
        },
    }
}

#[tauri::command]
#[specta::specta]
pub async fn cancel_task_request(
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    id: Uuid,
) -> Result<TaskStatus, String> {
    let mut container = task_container.lock().await;
    let task = container.get(id).await;

    match task {
        Some(task) => {
            let mut task = task.lock().await;
            let status = task.abort().await?;
            Ok(status)
        }
        None => {
            log::error!("Task not found: {:?}", id);
            Err("Task not found.".into())
        },
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_task_error(
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    id: Uuid,
) -> Result<Option<String>, String> {
    let mut container = task_container.lock().await;
    let task = container.get(id).await;

    match task {
        Some(task) => {
            let task = task.lock().await;
            let error = task.get_error().await;
            Ok(error)
        }
        None => {
            log::error!("Task not found: {:?}", id);
            Err("Task not found.".into())
        },
    }
}
