FROM golang:1.10 AS build
WORKDIR /go/src
COPY src ./src
COPY main.go .

ENV CGO_ENABLED=0
RUN go get -d -v ./...

RUN go build -a -installsuffix cgo -o mb3server .

FROM scratch AS runtime
COPY --from=build /go/src/mb3server ./
EXPOSE 8080/tcp
ENTRYPOINT ["./mb3server"]
