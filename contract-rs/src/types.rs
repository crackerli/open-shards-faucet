use serde::{Deserialize, Deserializer, Serialize, Serializer};
use std::convert::{TryFrom, TryInto};

pub struct U128(pub u128);

impl From<u128> for U128 {
    fn from(v: u128) -> Self {
        Self(v)
    }
}

impl From<U128> for u128 {
    fn from(v: U128) -> u128 {
        v.0
    }
}

impl Serialize for U128 {
    fn serialize<S>(&self, serializer: S) -> Result<<S as Serializer>::Ok, <S as Serializer>::Error>
        where
            S: Serializer,
    {
        serializer.serialize_str(&self.0.to_string())
    }
}

impl<'de> Deserialize<'de> for U128 {
    fn deserialize<D>(deserializer: D) -> Result<Self, <D as Deserializer<'de>>::Error>
        where
            D: Deserializer<'de>,
    {
        let s: String = Deserialize::deserialize(deserializer)?;
        Ok(Self(
            u128::from_str_radix(&s, 10)
                .map_err(|err| serde::de::Error::custom(err.to_string()))?,
        ))
    }
}


/// PublicKey curve
#[derive(Serialize, Deserialize)]
pub enum CurveType {
    ED25519 = 0,
    SECP256K1 = 1,
}

impl TryFrom<String> for CurveType {
    type Error = Box<dyn std::error::Error>;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "ed25519" => Ok(CurveType::ED25519),
            "secp256k1" => Ok(CurveType::SECP256K1),
            _ => Err("Unknown curve kind".into()),
        }
    }
}

/// Public key in a binary format with string serialization.
/// e.g. `ed25519:3tysLvy7KGoE8pznUgXvSHa4vYyGvrDZFcT8jgb8PEQ6`
#[derive(Clone, PartialEq, PartialOrd, Ord, Eq)]
pub struct StrPublicKey(pub Vec<u8>);

impl StrPublicKey {
    fn split_key_type_data(value: &str) -> Result<(CurveType, &str), Box<dyn std::error::Error>> {
        if let Some(idx) = value.find(':') {
            let (prefix, key_data) = value.split_at(idx);
            Ok((CurveType::try_from(prefix.to_string())?, &key_data[1..]))
        } else {
            // If there is no Default is ED25519.
            Ok((CurveType::ED25519, value))
        }
    }
}

impl From<StrPublicKey> for Vec<u8> {
    fn from(v: StrPublicKey) -> Vec<u8> {
        v.0
    }
}

impl TryFrom<Vec<u8>> for StrPublicKey {
    type Error = Box<dyn std::error::Error>;

    fn try_from(v: Vec<u8>) -> Result<Self, Self::Error> {
        match v.len() {
            33 if v[0] == 0 => Ok(Self(v)),
            65 if v[0] == 1 => Ok(Self(v)),
            _ => Err("Invalid public key".into()),
        }
    }
}

impl serde::Serialize for StrPublicKey {
    fn serialize<S>(
        &self,
        serializer: S,
    ) -> Result<<S as serde::Serializer>::Ok, <S as serde::Serializer>::Error>
        where
            S: serde::Serializer,
    {
        serializer.serialize_str(&String::from(self))
    }
}

impl<'de> serde::Deserialize<'de> for StrPublicKey {
    fn deserialize<D>(deserializer: D) -> Result<Self, <D as serde::Deserializer<'de>>::Error>
        where
            D: serde::Deserializer<'de>,
    {
        let s = <String as serde::Deserialize>::deserialize(deserializer)?;
        s.try_into()
            .map_err(|err: Box<dyn std::error::Error>| serde::de::Error::custom(err.to_string()))
    }
}

impl From<&StrPublicKey> for String {
    fn from(str_public_key: &StrPublicKey) -> Self {
        match str_public_key.0[0] {
            0 => "ed25519:".to_string() + &bs58::encode(&str_public_key.0[1..]).into_string(),
            1 => "secp256k1:".to_string() + &bs58::encode(&str_public_key.0[1..]).into_string(),
            _ => panic!("Unexpected curve"),
        }
    }
}

impl TryFrom<String> for StrPublicKey {
    type Error = Box<dyn std::error::Error>;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Self::try_from(value.as_str())
    }
}

impl TryFrom<&str> for StrPublicKey {
    type Error = Box<dyn std::error::Error>;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let (key_type, key_data) = StrPublicKey::split_key_type_data(&value)?;
        let expected_length = match key_type {
            CurveType::ED25519 => 32,
            CurveType::SECP256K1 => 64,
        };
        let data = bs58::decode(key_data).into_vec()?;
        if data.len() != expected_length {
            return Err("Invalid length of the public key".into());
        }
        let mut res = Vec::with_capacity(1 + expected_length);
        match key_type {
            CurveType::ED25519 => res.push(0),
            CurveType::SECP256K1 => res.push(1),
        };
        res.extend(data);
        Ok(Self(res))
    }
}
