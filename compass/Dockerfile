FROM golang:1.14-alpine as builder

RUN apk update && apk add gcc libc-dev git

WORKDIR /app/compass

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN chmod a+rx build-plugins.sh
RUN sh build-plugins.sh
RUN go build -o ./out/compass cmd/*.go

# -----------------------------------------------

FROM alpine:3.12.0

COPY --from=builder /app/compass/plugins/*.so ./plugins/
COPY --from=builder /app/compass/out/compass .
COPY --from=builder /app/compass/migrations /migrations

EXPOSE 8080

ENTRYPOINT ["./compass"]
