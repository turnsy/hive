use actix_web::{web, http, App, HttpResponse, HttpServer, HttpRequest, Error};
use actix_cors::Cors;
use actix_web_actors::ws;

mod sockets;
use self::sockets::HiveSocket;

const ALLOWED_ORIGIN: &str = "http://localhost:3000";

// ws handshake and start HiveSocket actor
async fn echo_ws(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    ws::start(HiveSocket::new(), &req, stream)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin(ALLOWED_ORIGIN)
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);
        App::new()
            .wrap(cors)
            .service(web::resource("/ws").route(web::get().to(echo_ws)))
    })
    .bind("0.0.0.0:8080")
    .expect("Server error")
    .run()
    .await
}