FROM golang:1.13-alpine as builder

RUN apk add --no-cache git

WORKDIR /app/octopipe

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN go build -o ./out/octopipe cmd/*.go

# -----------------------------------------------

FROM alpine:3.12.0

COPY --from=builder /app/octopipe/out/octopipe .

EXPOSE 8080

ENTRYPOINT ["./octopipe"]
