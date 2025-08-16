# C++ Multiply Server Dockerfile
FROM ubuntu:22.04 AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    libprotobuf-dev \
    protobuf-compiler \
    protobuf-compiler-grpc \
    libgrpc++-dev \
    libgrpc-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY cpp/ .
COPY proto/calculator.proto ./

# Generate proto files and compile
RUN protoc -I. --cpp_out=. --grpc_out=. --plugin=protoc-gen-grpc=/usr/bin/grpc_cpp_plugin calculator.proto && \
    g++ -std=c++17 -o server multiply_server.cc calculator.pb.cc calculator.grpc.pb.cc \
    `pkg-config --cflags --libs grpc++ protobuf` -pthread

FROM ubuntu:22.04
WORKDIR /app
RUN apt-get update && apt-get install -y \
    libgrpc++1 \
    libprotobuf23 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /src/server /app/server

EXPOSE 50053

CMD ["/app/server"]
