FROM rust:1.79-slim
WORKDIR /usr/src/app
COPY ./src ./src
COPY ./Cargo.lock .
COPY ./Cargo.toml .
CMD ["cargo", "watch", "-x", "run"]