FROM golang@sha256:fdb0a031adf8f96a5169ea42f000c35ec3346b9a632952435b7de619e06bff2d as builder

RUN apk update && apk add gcc libc-dev git

WORKDIR /app/hermes

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN go build -o ./out/hermes cmd/*.go

# -----------------------------------------------

FROM alpine:3.12.0

COPY --from=builder /app/hermes/out/hermes .
COPY --from=builder /app/hermes/migrations /migrations

EXPOSE 8080

ENTRYPOINT ["./hermes"]
