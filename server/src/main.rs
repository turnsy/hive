use actix::prelude::*;
use actix_cors::Cors;
use actix_files as fs;
use actix_web::{http, web, App, Error, HttpRequest, HttpServer, Responder};
use actix_web_actors::ws;
mod sockets;
use sockets::{GenerateId, HiveSocketServer, HiveSocketSession};

const ALLOWED_ORIGIN: &str = "http://localhost:3000";

async fn ws_route(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<HiveSocketServer>>,
) -> Result<impl Responder, Error> {
    let id = srv.send(GenerateId).await.unwrap();
    ws::start(
        HiveSocketSession {
            id,
            addr: srv.get_ref().clone(),
        },
        &req,
        stream,
    )
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let server = HiveSocketServer::new().start();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(ALLOWED_ORIGIN)
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);
        App::new()
            .wrap(cors)
            .app_data(web::Data::new(server.clone()))
            .route("/ws", web::get().to(ws_route))
            .service(fs::Files::new("/static", "./files").show_files_listing())
    })
    .bind("0.0.0.0:8080")
    .expect("Server error")
    .run()
    .await
}
