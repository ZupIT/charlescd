FROM golang@sha256:dc5787428863f5e2f832b52bf7405c191c575a9b38a19ae4d0cc641079242e63 as builder

RUN apk update && apk add gcc libc-dev git

WORKDIR /app/gate

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN go build -o ./out/gate cmd/*.go

# -----------------------------------------------

FROM alpine@sha256:a15790640a6690aa1730c38cf0a440e2aa44aaca9b0e8931a9f2b0d7cc90fd65

COPY --from=builder /app/gate/out/gate .
COPY --from=builder /app/gate/resources/migrations resources/migrations
COPY --from=builder /app/gate/resources/auth.conf resources/
COPY --from=builder /app/gate/resources/policy.csv resources/
COPY --from=builder /app/gate/internal/repository/queries internal/repository/queries

EXPOSE 8080

ENTRYPOINT ["./gate"]