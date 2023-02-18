FROM golang:1.20-alpine

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest
COPY . .
RUN go mod download && go mod verify

CMD air