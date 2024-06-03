use serde_derive::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum MessageVariant {
    Delta,
    Document,
    IncomingConnection,
    Error,
}
#[derive(Serialize, Deserialize)]
pub struct SocketMessage {
    pub variant: MessageVariant,
    pub content: String,
}
