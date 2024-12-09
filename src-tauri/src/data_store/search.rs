use crate::definitions::entities::AssetItem;

pub fn search(items: Vec<AssetItem>, words: Vec<String>) -> Vec<String> {
    let mut result_id_vec: Vec<String> = Vec::new();
    for item in items {
        for word in &words {
            if item.title.contains(word) {
                result_id_vec.push(item.id);
                break;
            }
        }
    }

    result_id_vec
}
