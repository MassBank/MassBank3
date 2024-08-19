FROM docker.io/golang:1.20 AS build
WORKDIR /go/src
COPY cmd/mb3server/src ./cmd/mb3server/src
COPY cmd/mb3server/main.go ./cmd/mb3server
COPY pkg ./pkg
COPY go.mod .

ENV CGO_ENABLED=0
RUN go get -d -v ./...

RUN go build -a -installsuffix cgo -o mb3server ./cmd/mb3server

FROM scratch AS runtime
COPY --from=build /go/src/mb3server ./
EXPOSE 8080/tcp
ENTRYPOINT ["./mb3server"]
