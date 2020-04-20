FROM golang:1.13-alpine

RUN apk add --no-cache git

# Set the Current Working Directory inside the container
WORKDIR /app/octopipe

# We want to populate the module cache based on the go.{mod,sum} files.
COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

# Build the Go app
RUN go build -o ./out/octopipe cmd/octopipe/*.go


# This container exposes port 8080 to the outside world
EXPOSE 8080

# Run the binary program produced by `go install`
ENTRYPOINT ["./out/octopipe"]