use std::time::Duration;

const VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn get_reqwest_client() -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .user_agent(format!("KonoAsset/{}", VERSION))
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|e| format!("Failed to create reqwest client: {}", e))
}
