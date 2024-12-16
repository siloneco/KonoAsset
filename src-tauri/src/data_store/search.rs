use uuid::Uuid;

use crate::definitions::entities::AssetDescription;

use super::provider::StoreProvider;

pub fn text_search(store: &StoreProvider, query: &str) -> Vec<Uuid> {
    let texts = split_by_space(query);
    let mut results = Vec::new();

    store
        .get_avatar_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            if check_text_contains(&asset.description, &texts)
            {
                results.push(asset.id);
            }
        });

    store.get_avatar_related_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            if check_text_contains(&asset.description, &texts)
            {
                results.push(asset.id);
            }
        });
        
    store.get_world_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            if check_text_contains(&asset.description, &texts)
            {
                results.push(asset.id);
            }
        });

    results
}

fn check_text_contains(description: &AssetDescription, texts: &Vec<&str>) -> bool {
    texts.iter().map(|text| text.to_ascii_lowercase()).any(|text| {
        return // タイトルに含まれているか
        description
            .title
            .to_ascii_lowercase()
            .contains(&text) ||
    
        // 作者名に含まれているか
        description
            .author
            .to_ascii_lowercase()
            .contains(&text) ||
        
        // タグに含まれているか
        description
            .tags
            .iter()
            .any(|tag| tag.to_ascii_lowercase().contains(&text))
    })
}

fn split_by_space(text: &str) -> Vec<&str> {
    text.split_whitespace().collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_split_by_space() {
        assert_eq!(split_by_space("Splitted Texts"), vec!["Splitted", "Texts"]);
        assert_eq!(split_by_space("日本語　クエリ"), vec!["日本語", "クエリ"]);
    }

    #[test]
    fn test_check_text_contains() {
        let description = AssetDescription {
            title: "これはアセットのタイトルです".to_string(),
            author: "これは制作者の名前です".to_string(),
            image_src: "".into(),
            tags: vec!["タグ1".to_string(), "タグ2".to_string()],
            created_at: chrono::Local::now(),
        };

        assert_eq!(check_text_contains(&description, &vec!["アセット"]), true);
        assert_eq!(check_text_contains(&description, &vec!["制作者"]), true);
        assert_eq!(check_text_contains(&description, &vec!["タグ1"]), true);
        assert_eq!(check_text_contains(&description, &vec!["タグ2"]), true);

        assert_eq!(check_text_contains(&description, &vec!["タグ3"]), false);
        assert_eq!(check_text_contains(&description, &vec!["存在しない単語"]), false);
    }
}