use std::env;

use actix::prelude::*;
use actix_cors::Cors;
use actix_files as fs;
use actix_web::{get, http, web, App, Error, HttpRequest, HttpServer, Responder};
use actix_web_actors::ws;
mod sockets;
mod file_tree;
use file_tree::{get_filetree, TreeNode};
use serde_derive::Deserialize;
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

#[derive(Deserialize)]
struct FiletreeParams {
    project_uuid: String,
}

#[get("/filetree/{project_uuid}")]
async fn filetree(info: web::Path<FiletreeParams>) -> web::Json<TreeNode> {
    let project_dir = env::current_dir().unwrap().join(format!("./files/{}", &info.project_uuid));
    web::Json(get_filetree(project_dir))
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
            .service(filetree)
    })
    .bind("0.0.0.0:8080")
    .expect("Server error")
    .run()
    .await
}
