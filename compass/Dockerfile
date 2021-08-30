FROM golang@sha256:1e79aec131a47c7aeb12f85da8fe048cab2539fd28fec91aa0de0845f14e4068 as builder

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

COPY --from=builder /app/compass/dist /plugins
COPY --from=builder /app/compass/out/compass .
COPY --from=builder /app/compass/migrations /migrations
COPY --from=builder /app/compass/auth.conf .
COPY --from=builder /app/compass/policy.csv .

EXPOSE 8080

ENTRYPOINT ["./compass"]
