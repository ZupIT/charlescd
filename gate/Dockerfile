FROM golang:1.15-alpine as builder

RUN apk update && apk add gcc libc-dev git

WORKDIR /app/gate

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN go build -o ./out/gate cmd/*.go

# -----------------------------------------------

FROM alpine:3.12.0

COPY --from=builder /app/gate/out/gate .
COPY --from=builder /app/gate/resources/migrations resources/migrations
COPY --from=builder /app/gate/resources/auth.conf resources/
COPY --from=builder /app/gate/resources/policy.csv resources/
COPY --from=builder /app/gate/internal/repository/queries internal/repository/queries

EXPOSE 8080

ENTRYPOINT ["./gate"]