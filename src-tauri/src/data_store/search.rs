use kanaria::{string::UCSStr, utils::ConvertTarget};
use uuid::Uuid;

use crate::definitions::{
    entities::{AssetDescription, AssetType, FilterRequest, MatchType},
    traits::AssetTrait,
};

use super::provider::StoreProvider;

pub async fn filter(store: &StoreProvider, req: &FilterRequest) -> Vec<Uuid> {
    let mut results = Vec::new();

    let text_filters: Option<Vec<&str>> = match &req.query_text {
        Some(text) => Some(split_by_space(text)),
        None => None,
    };

    if req.asset_type.is_none() || req.asset_type.as_ref().unwrap() == &AssetType::Avatar {
        store
            .get_avatar_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                // カテゴリが指定されている場合はアバターにカテゴリの概念がないので全部スキップ
                if req.categories.is_some() {
                    return;
                }
                // 対応アバターが指定されている場合はアバターに対応アバターの概念がないので全部スキップ
                if req.supported_avatars.is_some() {
                    return;
                }
                // 文字検索が指定されている場合は、含まれているかを確認
                if let Some(text_filters) = &text_filters {
                    if !check_text_contains(&asset.description, text_filters) {
                        return;
                    }
                }

                // タグが指定されている場合
                if let Some(tags) = &req.tags {
                    let mut iter = tags.iter();

                    if req.tag_match_type == MatchType::AND {
                        // タグ検索がANDの場合
                        if !iter.all(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    } else if req.tag_match_type == MatchType::OR {
                        // タグ検索がORの場合
                        if !iter.any(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    }
                }

                results.push(asset.get_id());
            });
    }

    if req.asset_type.is_none() || req.asset_type.as_ref().unwrap() == &AssetType::AvatarWearable {
        store
            .get_avatar_wearable_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                // 文字検索が指定されている場合は、含まれているかを確認
                if let Some(text_filters) = &text_filters {
                    if !check_text_contains(&asset.description, text_filters) {
                        return;
                    }
                }

                // カテゴリが指定されている場合
                if let Some(categories) = &req.categories {
                    if !categories
                        .iter()
                        .any(|category| asset.category.contains(category))
                    {
                        return;
                    }
                }
                // 対応アバターが指定されている場合
                if let Some(supported_avatars) = &req.supported_avatars {
                    let mut iter = supported_avatars.iter();

                    if req.supported_avatar_match_type == MatchType::AND {
                        // 対応アバター検索がANDの場合
                        if !iter.all(|avatar| asset.supported_avatars.contains(avatar)) {
                            return;
                        }
                    } else if req.supported_avatar_match_type == MatchType::OR {
                        // 対応アバター検索がORの場合
                        if !iter.any(|avatar| asset.supported_avatars.contains(avatar)) {
                            return;
                        }
                    }
                }

                // タグが指定されている場合は、そのタグが全て設定されているかを確認
                if let Some(tags) = &req.tags {
                    let mut iter = tags.iter();

                    if req.tag_match_type == MatchType::AND {
                        // タグ検索がANDの場合
                        if !iter.all(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    } else if req.tag_match_type == MatchType::OR {
                        // タグ検索がORの場合
                        if !iter.any(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    }
                }

                results.push(asset.get_id());
            });
    }

    if req.asset_type.is_none() || req.asset_type.as_ref().unwrap() == &AssetType::WorldObject {
        store
            .get_world_object_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                // 対応アバターが指定されている場合は、ワールドアセットに対応アバターの概念がないので全部スキップ
                if req.supported_avatars.is_some() {
                    return;
                }
                // 文字検索が指定されている場合は、含まれているかを確認
                if let Some(text_filters) = &text_filters {
                    if !check_text_contains(&asset.description, text_filters) {
                        return;
                    }
                }
                // カテゴリが指定されている場合は、そのカテゴリが設定されているかを確認
                if let Some(categories) = &req.categories {
                    if !categories
                        .iter()
                        .any(|category| asset.category.contains(category))
                    {
                        return;
                    }
                }
                // タグが指定されている場合は、そのタグが全て設定されているかを確認
                if let Some(tags) = &req.tags {
                    let mut iter = tags.iter();

                    if req.tag_match_type == MatchType::AND {
                        // タグ検索がANDの場合
                        if !iter.all(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    } else if req.tag_match_type == MatchType::OR {
                        // タグ検索がORの場合
                        if !iter.any(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    }
                }

                results.push(asset.get_id());
            });
    }

    if req.asset_type.is_none() || req.asset_type.as_ref().unwrap() == &AssetType::OtherAsset {
        store
            .get_other_asset_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                // 対応アバターが指定されている場合は、その他のアセットタイプに対応アバターの概念がないので全部スキップ
                if req.supported_avatars.is_some() {
                    return;
                }
                // 文字検索が指定されている場合は、含まれているかを確認
                if let Some(text_filters) = &text_filters {
                    if !check_text_contains(&asset.description, text_filters) {
                        return;
                    }
                }
                // カテゴリが指定されている場合は、そのカテゴリが設定されているかを確認
                if let Some(categories) = &req.categories {
                    if !categories
                        .iter()
                        .any(|category| asset.category.contains(category))
                    {
                        return;
                    }
                }
                // タグが指定されている場合は、そのタグが全て設定されているかを確認
                if let Some(tags) = &req.tags {
                    let mut iter = tags.iter();

                    if req.tag_match_type == MatchType::AND {
                        // タグ検索がANDの場合
                        if !iter.all(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    } else if req.tag_match_type == MatchType::OR {
                        // タグ検索がORの場合
                        if !iter.any(|tag| asset.description.tags.contains(&tag)) {
                            return;
                        }
                    }
                }

                results.push(asset.get_id());
            });
    }

    results
}

fn check_text_contains(description: &AssetDescription, texts: &Vec<&str>) -> bool {
    texts.iter().map(|text| unify_text(text)).all(|text| {
        if text.starts_with("name:") {
            return contains_text(&description.name.to_ascii_lowercase(), &text[5..]);
        }

        if text.starts_with("creator:") {
            return contains_text(&description.creator.to_ascii_lowercase(), &text[8..]);
        }

        if text.starts_with("tag:") {
            return description
                .tags
                .iter()
                .any(|tag| contains_text(tag, &text[4..]));
        }

        return
            // タイトルに含まれているか
            contains_text(&description.name.to_ascii_lowercase(), &text) ||
            // 作者名に含まれているか
            contains_text(&description.creator.to_ascii_lowercase(), &text) ||
            // タグに含まれているか
            description
                .tags
                .iter()
                .any(|tag| contains_text(tag, &text)) ||
            // メモに含まれているか
            description
                .memo
                .as_ref()
                .map_or(false, |memo| contains_text(&memo.to_ascii_lowercase(), &text)) ||
            // BOOTHのアイテムIDに含まれているかどうか
            description.booth_item_id.map_or(false, |id| id.to_string().contains(&text));
    })
}

fn split_by_space(text: &str) -> Vec<&str> {
    text.split_whitespace().collect()
}

fn contains_text(t1: &str, hiragana_text: &str) -> bool {
    unify_text(t1).contains(hiragana_text)
}

fn unify_text(text: &str) -> String {
    UCSStr::from_str(text)
        .hiragana()
        .narrow(ConvertTarget::NUMBER)
        .narrow(ConvertTarget::ALPHABET)
        .to_string()
        .to_ascii_lowercase()
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
            name: "これはアセットの名前です".to_string(),
            creator: "これは制作者の名前です".to_string(),
            image_filename: None,
            tags: vec!["タグ1".to_string(), "タグ2".to_string(), "tag3".to_string()],
            memo: Some("メモ".to_string()),
            booth_item_id: Some(6641548),
            dependencies: vec![],
            created_at: chrono::Local::now().timestamp_millis(),
            published_at: Some(chrono::Local::now().timestamp_millis()),
        };

        assert_eq!(check_text_contains(&description, &vec!["アセット"]), true);
        assert_eq!(check_text_contains(&description, &vec!["制作者"]), true);
        assert_eq!(check_text_contains(&description, &vec!["タグ1"]), true);
        assert_eq!(check_text_contains(&description, &vec!["タグ2"]), true);
        assert_eq!(check_text_contains(&description, &vec!["メモ"]), true);

        // ひらがなとカタカナを区別しない
        assert_eq!(check_text_contains(&description, &vec!["あせっと"]), true);
        // 全角数字と半角数字、全角アルファベットと半角アルファベットを区別しない
        assert_eq!(check_text_contains(&description, &vec!["たぐ１"]), true);
        assert_eq!(check_text_contains(&description, &vec!["Ｔａｇ"]), true);

        // BOOTHのアイテムIDを指定して検索できる
        assert_eq!(check_text_contains(&description, &vec!["6641548"]), true);

        // prefixを考慮する
        assert_eq!(
            check_text_contains(&description, &vec!["name:アセットの名前"]),
            true
        );
        assert_eq!(
            check_text_contains(&description, &vec!["creator:制作者の名前"]),
            true
        );
        assert_eq!(check_text_contains(&description, &vec!["tag:タグ1"]), true);

        assert_eq!(check_text_contains(&description, &vec!["タグ3"]), false);
        assert_eq!(
            check_text_contains(&description, &vec!["存在しない単語"]),
            false
        );

        // 対象が違う場合には反応しない
        assert_eq!(
            check_text_contains(&description, &vec!["name:制作者の名前"]),
            false
        );
        assert_eq!(
            check_text_contains(&description, &vec!["creator:タグ"]),
            false
        );
    }
}
