FROM golang:1.14-alpine

RUN apk add --no-cache git

WORKDIR /app/quiz_app

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN go build -o ./out/quiz_app cmd/*.go

EXPOSE 8080

ENTRYPOINT ["./out/quiz_app"]