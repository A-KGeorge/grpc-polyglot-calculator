FROM golang:1.23-alpine AS builder

# Install protobuf compiler
RUN apk add --no-cache protobuf protobuf-dev

WORKDIR /app

# Copy go module files first for better caching
COPY go/go.mod go/go.sum ./
RUN go mod download

# Copy source code and generated protobuf files
COPY go/ .

# Build the application
RUN go build -o server mod_server.go

FROM alpine:3.20

# Install ca-certificates for SSL/TLS
RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app/server .

EXPOSE 50055

CMD ["./server"]
