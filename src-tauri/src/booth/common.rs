use std::time::Duration;

const VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn get_reqwest_client() -> reqwest::Client {
    reqwest::Client::builder()
        .user_agent(format!("KonoAsset/{}", VERSION))
        .timeout(Duration::from_secs(5))
        .build()
        .unwrap()
}
