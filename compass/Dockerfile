FROM golang@sha256:ef409ff24dd3d79ec313efe88153d703fee8b80a522d294bb7908216dc7aa168 as builder

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

FROM alpine@sha256:a15790640a6690aa1730c38cf0a440e2aa44aaca9b0e8931a9f2b0d7cc90fd65

COPY --from=builder /app/compass/dist /plugins
COPY --from=builder /app/compass/out/compass .
COPY --from=builder /app/compass/migrations /migrations
COPY --from=builder /app/compass/auth.conf .
COPY --from=builder /app/compass/policy.csv .

EXPOSE 8080

ENTRYPOINT ["./compass"]
