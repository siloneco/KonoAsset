use std::collections::HashSet;

use serde::{de::DeserializeOwned, Serialize};

// pub trait VersionedLoader<T> {
//     type VersionedType: Serialize
//         + DeserializeOwned
//         + TryInto<T, Error = String>
//         + TryFrom<T, Error = String>;
// }

pub trait HashSetVersionedLoader<T> {
    type VersionedType: Serialize
        + DeserializeOwned
        + TryInto<HashSet<T>, Error = String>
        + TryFrom<HashSet<T>, Error = String>;
}
