use std::time::Duration;

pub fn get_reqwest_client<S: AsRef<str>>(version: S) -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .user_agent(format!("KonoAsset/{}", version.as_ref()))
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|e| format!("Failed to create reqwest client: {}", e))
}
