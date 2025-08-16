# Single-stage Rust build with Debian bookworm for GLIBC compatibility
FROM debian:bookworm

WORKDIR /app

# Install dependencies including Rust
RUN apt-get update && \
    apt-get install -y curl build-essential protobuf-compiler ca-certificates pkg-config libssl-dev && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    rm -rf /var/lib/apt/lists/*

# Add cargo to PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy source code
COPY rust/ .
COPY proto/ ../proto/

# Build the application
RUN cargo build --release

EXPOSE 50054

CMD ["./target/release/rust"]
