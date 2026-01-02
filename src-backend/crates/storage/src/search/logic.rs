use kanaria::{string::UCSStr, utils::ConvertTarget};
use model::AssetDescription;
use uuid::Uuid;

use crate::{
    asset_storage::AssetStorage,
    definitions::{FilterElement, FilterRequest, FilterRequirement},
    search::definitions::{FilterOptimizedAssets, OptionalFeature},
};

pub async fn filter(store: &AssetStorage, req: &FilterRequest) -> Vec<Uuid> {
    let avatars = store.get_avatar_store().get_all().await;
    let avatar_wearables = store.get_avatar_wearable_store().get_all().await;
    let world_objects = store.get_world_object_store().get_all().await;
    let other_assets = store.get_other_asset_store().get_all().await;

    let filter_optimized_avatars: Vec<FilterOptimizedAssets> =
        avatars.iter().map(|a| a.into()).collect();
    let filter_optimized_avatar_wearables: Vec<FilterOptimizedAssets> =
        avatar_wearables.iter().map(|a| a.into()).collect();
    let filter_optimized_world_objects: Vec<FilterOptimizedAssets> =
        world_objects.iter().map(|a| a.into()).collect();
    let filter_optimized_other_assets: Vec<FilterOptimizedAssets> =
        other_assets.iter().map(|a| a.into()).collect();

    let mut items = Vec::with_capacity(
        avatars.len() + avatar_wearables.len() + world_objects.len() + other_assets.len(),
    );

    items.extend(filter_optimized_avatars);
    items.extend(filter_optimized_avatar_wearables);
    items.extend(filter_optimized_world_objects);
    items.extend(filter_optimized_other_assets);

    filter_items(&items, req)
        .into_iter()
        .map(|id| *id)
        .collect()
}

fn filter_items<'a>(items: &'a [FilterOptimizedAssets], req: &FilterRequest) -> Vec<&'a Uuid> {
    let mut results = Vec::new();

    let text_filters: Option<Vec<&str>> = match &req.query_text {
        Some(text) => Some(split_by_space(text)),
        None => None,
    };

    items.iter().for_each(|item| {
        // アセットタイプの検査
        if let Some(asset_type) = req.asset_type
            && item.asset_type != asset_type
        {
            return;
        }

        // カテゴリの検査
        if let Some(category) = &req.categories {
            // カテゴリが実装されていない場合は除外
            let OptionalFeature::Implemented(item_category) = item.category else {
                return;
            };

            match category {
                FilterElement::AND(categories) => {
                    // AND指定でカテゴリが未入力の場合は除外
                    let Some(item_category) = item_category else {
                        return;
                    };

                    // ANDなので、「全部マッチする」が満たされなかったら除外
                    if !categories.iter().all(|category| match category {
                        FilterRequirement::Include(category) => category == item_category, // Include の場合は一致する場合に true
                        FilterRequirement::Exclude(category) => category != item_category, // Exclude の場合は一致しない場合に true
                    }) {
                        return;
                    }
                }
                FilterElement::OR(categories) => {
                    // OR指定でカテゴリが未入力の場合は除外
                    let Some(item_category) = item_category else {
                        return;
                    };

                    // 指定はORだが、Excludeは使い方的に全部ANDで処理するので、IncludeとExcludeを分ける
                    let (include_categories, exclude_categories): (Vec<_>, Vec<_>) =
                        categories.iter().partition(|category| match category {
                            FilterRequirement::Include(_) => true,
                            FilterRequirement::Exclude(_) => false,
                        });

                    // ORなので、Includeは「どれか1つでもマッチする」が満たされなかったら除外
                    // なお Include の条件数が0ならスキップ
                    if include_categories.len() > 0
                        && !include_categories
                            .iter()
                            .any(|category| category.value() == item_category)
                    {
                        return;
                    }

                    // Excludeは常にANDとして処理するので、「全部マッチする」が満たされなかったら除外
                    // なお Exclude の条件数が0ならスキップ
                    if exclude_categories.len() > 0
                        && !exclude_categories
                            .iter()
                            .all(|category| category.value() != item_category)
                    {
                        return;
                    }
                }
                FilterElement::Unfilled => {
                    // 未入力を表示したいので、カテゴリが入力されていたら除外
                    if item_category.is_some() {
                        return;
                    }
                }
            }
        }

        // タグの検査
        if let Some(tags) = &req.tags {
            let item_tags = &item.description.tags;

            match tags {
                FilterElement::AND(tags) => {
                    // ANDなので、「全部マッチする」が満たされなかったら除外
                    if !tags.iter().all(|tag| match tag {
                        FilterRequirement::Include(tag) => item_tags.contains(tag), // Include の場合は一致する場合に true
                        FilterRequirement::Exclude(tag) => !item_tags.contains(tag), // Exclude の場合は一致しない場合に true
                    }) {
                        return;
                    }
                }
                FilterElement::OR(tags) => {
                    // 指定はORだが、Excludeは使い方的に全部ANDで処理するので、IncludeとExcludeを分ける
                    let (include_tags, exclude_tags): (Vec<_>, Vec<_>) =
                        tags.iter().partition(|tag| match tag {
                            FilterRequirement::Include(_) => true,
                            FilterRequirement::Exclude(_) => false,
                        });

                    // ORなので、Includeは「どれか1つでもマッチする」が満たされなかったら除外
                    // なお Include の条件数が0ならスキップ
                    if include_tags.len() > 0
                        && !include_tags
                            .iter()
                            .any(|tag| item_tags.contains(tag.value()))
                    {
                        return;
                    }

                    // Excludeは常にANDとして処理するので、「全部マッチする」が満たされなかったら除外
                    // なお Exclude の条件数が0ならスキップ
                    if exclude_tags.len() > 0
                        && !exclude_tags
                            .iter()
                            .all(|tag| !item_tags.contains(tag.value()))
                    {
                        return;
                    }
                }
                FilterElement::Unfilled => {
                    // 未入力を表示したいので、タグが入力されていたら除外
                    if !item_tags.is_empty() {
                        return;
                    }
                }
            }
        }

        // 対応アバターの検査
        if let Some(supported_avatars) = &req.supported_avatars {
            let item_supported_avatars = &item.supported_avatars;

            // 対応アバターが実装されていない場合は除外
            let OptionalFeature::Implemented(item_sup_avatars) = item_supported_avatars else {
                return;
            };

            match supported_avatars {
                FilterElement::AND(supported_avatars) => {
                    // ANDなので、「全部マッチする」が満たされなかったら除外
                    if !supported_avatars.iter().all(|avatar| match avatar {
                        FilterRequirement::Include(avatar) => item_sup_avatars.contains(avatar), // Include の場合は一致する場合に true
                        FilterRequirement::Exclude(avatar) => !item_sup_avatars.contains(avatar), // Exclude の場合は一致しない場合に true
                    }) {
                        return;
                    }
                }
                FilterElement::OR(supported_avatars) => {
                    // 指定はORだが、Excludeは使い方的に全部ANDで処理するので、IncludeとExcludeを分ける
                    let (include_avatars, exclude_avatars): (Vec<_>, Vec<_>) =
                        supported_avatars.iter().partition(|avatar| match avatar {
                            FilterRequirement::Include(_) => true,
                            FilterRequirement::Exclude(_) => false,
                        });

                    // ORなので、Includeは「どれか1つでもマッチする」が満たされなかったら除外
                    if include_avatars.len() > 0
                        && !include_avatars
                            .iter()
                            .any(|avatar| item_sup_avatars.contains(avatar.value()))
                    {
                        return;
                    }

                    // Excludeは常にANDとして処理するので、「全部マッチする」が満たされなかったら除外
                    if exclude_avatars.len() > 0
                        && !exclude_avatars
                            .iter()
                            .all(|avatar| !item_sup_avatars.contains(avatar.value()))
                    {
                        return;
                    }
                }
                FilterElement::Unfilled => {
                    // 未入力を表示したいので、対応アバターが入力されていたら除外
                    if !item_sup_avatars.is_empty() {
                        return;
                    }
                }
            }
        }

        // テキスト検索
        if let Some(text_filters) = &text_filters {
            // テキストのチェックで弾かれたら除外
            if !check_text_contains(&item.description, text_filters) {
                return;
            }
        }

        // ここまで到達したら全ての条件を満たしているアセットである
        results.push(item.id);
    });

    results
}

fn check_text_contains(description: &AssetDescription, texts: &Vec<&str>) -> bool {
    // Split texts into inclusion and exclusion terms
    let (inclusion_terms, exclusion_terms): (Vec<&str>, Vec<&str>) =
        texts.iter().partition(|&&text| !text.starts_with("-"));

    // First check if any exclusion term matches - if so, return false
    for text in exclusion_terms {
        let search_text = &text[1..]; // Remove the leading hyphen

        if search_text.is_empty() {
            continue;
        }

        if check_single_text(description, search_text) {
            return false;
        }
    }

    // Then check if all inclusion terms match
    inclusion_terms
        .iter()
        .all(|&text| check_single_text(description, text))
}

fn check_single_text(description: &AssetDescription, text: &str) -> bool {
    let text = unify_text(text);

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

    #[test]
    fn test_not_search() {
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

        // Basic NOT search
        assert_eq!(
            check_text_contains(&description, &vec!["アセット", "-タグ3"]),
            true
        );
        assert_eq!(
            check_text_contains(&description, &vec!["アセット", "-タグ1"]),
            false
        );

        // Multiple NOT terms
        assert_eq!(
            check_text_contains(&description, &vec!["アセット", "-タグ3", "-タグ4"]),
            true
        );
        assert_eq!(
            check_text_contains(&description, &vec!["アセット", "-タグ1", "-タグ2"]),
            false
        );

        // NOT search with prefixes
        assert_eq!(
            check_text_contains(&description, &vec!["name:アセット", "-tag:タグ3"]),
            true
        );
        assert_eq!(
            check_text_contains(&description, &vec!["name:アセット", "-tag:タグ1"]),
            false
        );
    }
}
