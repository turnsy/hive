use std::time::{Duration, Instant};
use actix::prelude::*;
use actix_web_actors::ws;
use actix::Actor;
mod ops;
use ops::handle_op_message;

// heartbeat ping frequency
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);

// how long until timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

// handling web socket with actors
pub struct HiveSocket {
    hb: Instant,
}

impl HiveSocket {
    pub fn new() -> Self {
        Self { hb: Instant::now() }
    }

    fn hb(&self, ctx: &mut <Self as Actor>::Context) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {

            // check heartbeat of clients
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                // heartbeat timed out
                println!("Websocket Client heartbeat failed, disconnecting");

                // stop actor
                ctx.stop();

                // dont send ping
                return;
            }

            ctx.ping(b"");
        });
    }
}

impl Actor for HiveSocket {
    type Context = ws::WebsocketContext<Self>;
    
    // method called on actor start; heartbeat process starts here
    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for HiveSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {

        println!("WS: {msg:?}");
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.hb = Instant::now();
            }
            Ok(ws::Message::Text(text)) => {
                // echo back to caller
                let msg = match handle_op_message(text.as_ref()) {
                    Ok(res) => {
                        res
                    },
                    Err(err) => {
                        err.to_string()
                    }
                };
                ctx.text(msg);
            },
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}