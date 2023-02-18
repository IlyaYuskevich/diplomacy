FROM golang:1.20-alpine

WORKDIR /app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod ./
COPY go.sum ./
RUN go mod download && go mod verify

COPY *.go ./
RUN go build -o /docker-diplomacy

CMD ["/docker-diplomacy"]