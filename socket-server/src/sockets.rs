use actix::prelude::*;
use actix::Actor;
use actix_web_actors::ws;
use std::sync::{Arc, Mutex};
use std::{collections::HashMap, fs, path::Path};
mod ops;
use ops::handle_op_message;
mod messages;
use messages::{MessageVariant, SocketMessage};

pub struct HiveSocketSession {
    pub id: usize,
    pub addr: Addr<HiveSocketServer>,
}

impl Actor for HiveSocketSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let addr = ctx.address();
        self.addr
            .send(Connect {
                addr: addr.recipient(),
                id: self.id,
            })
            .into_actor(self)
            .then(|_, _, _| fut::ready(()))
            .wait(ctx);

        // Load the document from the file
        let f_path = Path::new("./files/test.txt");
        let f_string = fs::read_to_string(f_path).unwrap();
        let message = SocketMessage {
            variant: MessageVariant::Document,
            content: f_string,
        };
        ctx.text(serde_json::to_string(&message).unwrap());
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        self.addr.do_send(Disconnect { id: self.id });
        Running::Stop
    }
}

impl Handler<BroadcastMessage> for HiveSocketSession {
    type Result = ();

    fn handle(&mut self, msg: BroadcastMessage, ctx: &mut Self::Context) {
        ctx.text(msg.msg);
    }
}

#[derive(Message)]
#[rtype(result = "()")]
struct Connect {
    addr: Recipient<BroadcastMessage>,
    id: usize,
}

#[derive(Message)]
#[rtype(result = "()")]
struct Disconnect {
    id: usize,
}

#[derive(Message, Clone)]
#[rtype(result = "()")]
pub struct BroadcastMessage {
    msg: String,
    src_addr: Recipient<BroadcastMessage>,
}
#[derive(Message)]
#[rtype(result = "usize")]
pub struct GenerateId;

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for HiveSocketSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                // applies operation to file on backend
                match handle_op_message(text.as_ref()) {
                    Ok(msg) => {
                        println!("{:?}", msg);
                        // successful edit, broadcast change to other connected users
                        let delta_message = SocketMessage {
                            variant: MessageVariant::Delta,
                            content: msg,
                        };
                        let delta_message_str = serde_json::to_string(&delta_message).unwrap();

                        let src_addr = ctx.address().recipient();
                        self.addr.do_send(BroadcastMessage {
                            msg: delta_message_str,
                            src_addr,
                        });
                    }
                    Err(_) => {
                        // error making edit, thus we send error message back to frontend
                        let error_message = SocketMessage {
                            variant: MessageVariant::Error,
                            content: "Internal server error".to_string(),
                        };
                        ctx.text(serde_json::to_string(&error_message).unwrap());
                    }
                };
            }
            _ => ctx.stop(),
        }
    }
}

pub struct HiveSocketServer {
    pub sessions: Arc<Mutex<HashMap<usize, Recipient<BroadcastMessage>>>>,
    pub next_id: Arc<Mutex<usize>>,
}

impl HiveSocketServer {
    pub fn new() -> Self {
        HiveSocketServer {
            sessions: Arc::new(Mutex::new(HashMap::new())),
            next_id: Arc::new(Mutex::new(0)),
        }
    }
}

impl Actor for HiveSocketServer {
    type Context = Context<Self>;
}

impl Handler<Connect> for HiveSocketServer {
    type Result = ();

    fn handle(&mut self, msg: Connect, _: &mut Self::Context) {
        self.sessions.lock().unwrap().insert(msg.id, msg.addr);
    }
}

impl Handler<Disconnect> for HiveSocketServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Self::Context) {
        self.sessions.lock().unwrap().remove(&msg.id);
    }
}

impl Handler<BroadcastMessage> for HiveSocketServer {
    type Result = ();

    fn handle(&mut self, msg: BroadcastMessage, _: &mut Self::Context) {
        for addr in self.sessions.lock().unwrap().values() {
            // check that source address does not match the one being sent to.
            if *addr != msg.src_addr {
                addr.do_send(msg.clone());
            }
        }
    }
}

impl Handler<GenerateId> for HiveSocketServer {
    type Result = MessageResult<GenerateId>;

    fn handle(&mut self, _: GenerateId, _: &mut Self::Context) -> Self::Result {
        let mut id = self.next_id.lock().unwrap();
        *id += 1;
        MessageResult(*id)
    }
}
