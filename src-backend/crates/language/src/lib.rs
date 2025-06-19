mod loader;
mod structs;

pub use loader::load_from_file;
pub use structs::{
    CustomLanguageFileLoadResult, CustomLocalizationData, LanguageCode, LocalizationData,
};
