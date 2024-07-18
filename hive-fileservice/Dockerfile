FROM golang:1.22.5
WORKDIR /app
RUN go install github.com/air-verse/air@latest
COPY . .
CMD ["air"]