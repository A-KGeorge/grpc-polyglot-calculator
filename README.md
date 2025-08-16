# Polyglot gRPC Calculator - Multi-Language Expression Evaluator

A sophisticated distributed calculator system built with gRPC, demonstrating **polyglot microservices architecture** across 6 programming languages. Each arithmetic operation is implemented as a separate service in a different language, with an intelligent Node.js client that parses mathematical expressions using Abstract Syntax Trees (AST) and evaluates them through parallel gRPC calls.

## 🎯 Key Features

- **6 Different Programming Languages** - Each service showcases language-specific strengths
- **AST-based Expression Parsing** - Handles complex mathematical expressions with proper precedence
- **Parallel Evaluation** - Multiple operations executed concurrently via gRPC
- **Expression Support** - Parentheses, decimals, unary minus, operator precedence
- **Container Orchestration** - Fully dockerized with docker-compose
- **Production Patterns** - Error handling, logging, proper service dependencies

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Client[Node.js Client<br/>AST Parser + Evaluator<br/>Port 3000]
    end

    subgraph "Polyglot Service Mesh"
        subgraph "Python Service"
            AddSvc[Add Server<br/>Python<br/>Port 50051]
        end

        subgraph "Java Service"
            SubSvc[Subtract Server<br/>Java<br/>Port 50052]
        end

        subgraph "C++ Service"
            MulSvc[Multiply Server<br/>C++<br/>Port 50053]
        end

        subgraph "Rust Service"
            DivSvc[Divide Server<br/>Rust<br/>Port 50054]
        end

        subgraph "Go Service"
            ModSvc[Modulus Server<br/>Go<br/>Port 50055]
        end

        subgraph "Elixir Service"
            ExpSvc[Exponentiation Server<br/>Elixir<br/>Port 50056]
        end
    end

    subgraph "Protocol Definition"
        Proto[calculator.proto<br/>gRPC Service Definition]
    end

    Client -->|Parallel gRPC| AddSvc
    Client -->|Parallel gRPC| SubSvc
    Client -->|Parallel gRPC| MulSvc
    Client -->|Parallel gRPC| DivSvc
    Client -->|Parallel gRPC| ModSvc
    Client -->|Parallel gRPC| ExpSvc

    Proto -.->|Generates Code| AddSvc
    Proto -.->|Generates Code| SubSvc
    Proto -.->|Generates Code| MulSvc
    Proto -.->|Generates Code| DivSvc
    Proto -.->|Generates Code| ModSvc
    Proto -.->|Generates Code| ExpSvc
    Proto -.->|Generates Code| Client

    style Client fill:#e1f5fe
    style AddSvc fill:#e8f5e8
    style SubSvc fill:#fff3e0
    style MulSvc fill:#fce4ec
    style DivSvc fill:#f3e5f5
    style ModSvc fill:#e0f2f1
    style ExpSvc fill:#fce4ec
    style Proto fill:#f5f5f5
```

## 🚀 Technology Stack

| Component                 | Language | Framework/Library    | Port  | Purpose                         |
| ------------------------- | -------- | -------------------- | ----- | ------------------------------- |
| **Add Server**            | Python   | grpcio, grpcio-tools | 50051 | Addition operations             |
| **Subtract Server**       | Java     | gRPC Java, Maven     | 50052 | Subtraction operations          |
| **Multiply Server**       | C++      | gRPC C++, CMake      | 50053 | Multiplication operations       |
| **Divide Server**         | Rust     | Tonic, Tokio         | 50054 | Division operations             |
| **Modulus Server**        | Go       | gRPC Go              | 50055 | Modulus operations              |
| **Exponentiation Server** | Elixir   | gRPC Elixir          | 50056 | Exponentiation operations       |
| **AST Client**            | Node.js  | @grpc/grpc-js        | 3000  | Expression parsing & evaluation |

## 🧠 Expression Parsing & Evaluation

The Node.js client implements a sophisticated mathematical expression evaluator:

- **Tokenizer**: Breaks expressions into tokens (numbers, operators, parentheses)
- **AST Parser**: Builds Abstract Syntax Trees with proper operator precedence
- **Parallel Evaluator**: Executes operations concurrently via gRPC calls
- **Supported Features**:
  - Basic operators: `+ - * / % ^`
  - Parentheses for grouping: `(2 + 3) * 4`
  - Decimal numbers: `3.14 * 2.5`
  - Unary minus: `-5 + 10`
  - Complex expressions: `(10 + 5) * 2 - 8 / 4`

### Example Expressions

```bash
Enter expression: 2 + 3 * 4
# Parsed as: 2 + (3 * 4) = 14

Enter expression: (10 - 6) / 2 + 3^2
# Parsed as: ((10 - 6) / 2) + (3^2) = 11

Enter expression: -5.5 + 10 % 3
# Parsed as: (-5.5) + (10 % 3) = -4.5
```

## 📊 Service Communication Flow

```mermaid
sequenceDiagram
    participant C as Node.js Client (AST)
    participant P as Python Add (50051)
    participant J as Java Subtract (50052)
    participant CPP as C++ Multiply (50053)
    participant R as Rust Divide (50054)
    participant G as Go Modulus (50055)
    participant E as Elixir Exp (50056)

    Note over C: Expression: "(5 + 3) * 2^2 - 10 % 3"

    Note over C: 1. Parse to AST
    Note over C: 2. Identify operations needed

    par Parallel Execution
        C->>P: Add(5, 3)
        P-->>C: Result: 8
    and
        C->>E: Exponentiate(2, 2)
        E-->>C: Result: 4
    and
        C->>G: Modulus(10, 3)
        G-->>C: Result: 1
    end

    Note over C: 3. Continue with results

    par Next Level Operations
        C->>CPP: Multiply(8, 4)
        CPP-->>C: Result: 32
    end

    C->>J: Subtract(32, 1)
    J-->>C: Final Result: 31

    Note over C: Expression evaluated: 31
```

## 🐳 Docker Architecture

```mermaid
graph LR
    subgraph "Docker Network: calculator-network"
        subgraph "Python Container"
            PythonApp[Python Add Server<br/>calculator-python-add-server]
        end

        subgraph "Java Container"
            JavaApp[Java Subtract Server<br/>calculator-java-subtract-server]
        end

        subgraph "C++ Container"
            CppApp[C++ Multiply Server<br/>calculator-cpp-multiply-server]
        end

        subgraph "Rust Container"
            RustApp[Rust Divide Server<br/>calculator-rust-divide-server]
        end

        subgraph "Go Container"
            GoApp[Go Modulus Server<br/>calculator-go-mod-server]
        end

        subgraph "Elixir Container"
            ElixirApp[Elixir Exp Server<br/>calculator-elixir-exponent-server]
        end

        subgraph "Client Container"
            NodeApp[Node.js AST Client<br/>calculator-node-client]
        end
    end

    subgraph "Host Ports"
        P1[50051]
        P2[50052]
        P3[50053]
        P4[50054]
        P5[50055]
        P6[50056]
        P7[3000]
    end

    P1 --> PythonApp
    P2 --> JavaApp
    P3 --> CppApp
    P4 --> RustApp
    P5 --> GoApp
    P6 --> ElixirApp
    P7 --> NodeApp

    NodeApp -.->|Service Discovery| PythonApp
    NodeApp -.->|Service Discovery| JavaApp
    NodeApp -.->|Service Discovery| CppApp
    NodeApp -.->|Service Discovery| RustApp
    NodeApp -.->|Service Discovery| GoApp
    NodeApp -.->|Service Discovery| ElixirApp
```

## 📋 Protocol Buffer Definition

The system uses a unified Protocol Buffer definition (`calculator.proto`) that defines:

```protobuf
service Calculator {
    rpc Add(TwoNumbers) returns (Number);
    rpc Subtract(TwoNumbers) returns (Number);
    rpc Multiply(TwoNumbers) returns (Number);
    rpc Divide(TwoNumbers) returns (Number);
    rpc Modulus(TwoNumbers) returns (Number);
    rpc Exponentiate(TwoNumbers) returns (Number);
}

message TwoNumbers {
    double a = 1;
    double b = 2;
}

message Number {
    double result = 1;
}
```

## 🛠️ Build System Architecture

```mermaid
graph TD
    subgraph "Proto Generation"
        Proto[calculator.proto] --> PythonGen[Python: grpc_tools.protoc]
        Proto --> JavaGen[Java: protobuf-maven-plugin]
        Proto --> CppGen[C++: protoc + grpc_cpp_plugin]
        Proto --> RustGen[Rust: build.rs + tonic-build]
        Proto --> GoGen[Go: protoc-gen-go + protoc-gen-go-grpc]
        Proto --> ElixirGen[Elixir: protobuf + grpc packages]
        Proto --> NodeGen[Node.js: @grpc/proto-loader]
    end

    subgraph "Build Tools"
        PythonGen --> PythonBuild[pip install]
        JavaGen --> JavaBuild[Maven + Shade Plugin]
        CppGen --> CppBuild[CMake + g++]
        RustGen --> RustBuild[Cargo]
        GoGen --> GoBuild[go build]
        ElixirGen --> ElixirBuild[mix compile]
        NodeGen --> NodeBuild[npm install]
    end

    subgraph "Docker Images"
        PythonBuild --> PythonDocker[python:3.11-slim]
        JavaBuild --> JavaDocker[eclipse-temurin:17-jre]
        CppBuild --> CppDocker[ubuntu:22.04]
        RustBuild --> RustDocker[debian:bookworm]
        GoBuild --> GoDocker[golang:1.23-alpine]
        ElixirBuild --> ElixirDocker[elixir:1.16-alpine]
        NodeBuild --> NodeClientDocker[node:18-alpine]
    end

    style Proto fill:#f9f,stroke:#333,stroke-width:2px
```

## 🚦 Getting Started

### Prerequisites

- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Calculator
   ```

2. **Build and run the entire system**

   ```bash
   docker-compose up --build
   ```

3. **Interactive client usage**
   ```
   Polyglot gRPC Calculator (AST + parallel eval via generated stubs)
   supported: + (python) - (java) * (cpp) / (rust) % (go) ^ (elixir), parentheses, decimals, unary minus
   Enter expression: (5 + 3) * 2^2 - 10 % 3
   Result: 31
   ```

### Individual Service Development

#### Python Add Server

```bash
cd python
pip install grpcio grpcio-tools
python -m grpc_tools.protoc -I../proto --python_out=. --grpc_python_out=. ../proto/calculator.proto
python add_server.py
```

#### Java Subtract Server

```bash
cd java
mvn clean compile
mvn exec:java -Dexec.mainClass="subtract.SubtractServer"
```

#### C++ Multiply Server

```bash
cd cpp
mkdir -p build && cd build
cmake ..
make
./multiply_server
```

#### Rust Divide Server

```bash
cd rust
cargo build --release
cargo run
```

#### Go Modulus Server

```bash
cd go
go build -o server mod_server.go
./server
```

#### Elixir Exponentiation Server

```bash
cd elixir
mix deps.get
mix compile
mix start
```

#### Node.js AST Client

```bash
cd node
npm install
npm start
# Then enter mathematical expressions interactively
```

## 📁 Project Structure

```
Calculator/
├── proto/
│   ├── calculator.proto           # gRPC service definition
│   └── generate_stubs.ps1         # Cross-platform stub generation
├── python/
│   ├── add_server.py              # Python addition service
│   ├── Dockerfile
│   └── generated/                 # Generated Python gRPC code
├── java/
│   ├── src/main/java/subtract/    # Java subtraction service
│   ├── pom.xml                    # Maven configuration
│   └── Dockerfile
├── cpp/
│   ├── multiply_server.cc         # C++ multiplication service
│   ├── CMakeLists.txt
│   ├── build.ps1                  # Windows build script
│   ├── Dockerfile
│   └── generated/                 # Generated C++ gRPC code
├── rust/
│   ├── src/main.rs                # Rust division service
│   ├── build.rs                   # Build script for proto generation
│   ├── Cargo.toml
│   └── Dockerfile
├── go/
│   ├── mod_server.go              # Go modulus service
│   ├── go.mod                     # Go module definition
│   ├── Dockerfile
│   └── generated/                 # Generated Go gRPC code
├── elixir/
│   ├── lib/
│   │   ├── server.ex              # Elixir application & endpoint
│   │   ├── pow_server.ex          # Exponentiation service implementation
│   │   └── calculator.pb.ex       # Generated protobuf code
│   ├── mix.exs                    # Elixir project configuration
│   └── Dockerfile
├── node/
│   ├── src/
│   │   ├── cli.js                 # Interactive command-line interface
│   │   ├── tokenize.js            # Expression tokenizer
│   │   ├── parse.js               # AST parser
│   │   ├── eval.js                # AST evaluator with gRPC calls
│   │   ├── precedence.js          # Operator precedence definitions
│   │   └── services.js            # gRPC service clients
│   ├── package.json
│   ├── Dockerfile
│   └── generated/                 # Generated Node.js gRPC code
├── docker-compose.yml             # Container orchestration
├── test.js                        # Integration test script
└── README.md                      # This file
```

## 🔧 Configuration Details

### Service Dependencies

The system uses Docker Compose with dependency management:

- Java Subtract depends on Python Add
- C++ Multiply depends on Java Subtract
- Rust Divide depends on C++ Multiply
- Go Modulus depends on Rust Divide
- Elixir Exponentiation depends on Go Modulus
- Node.js Client depends on all servers

### Network Configuration

- **Docker Network**: `calculator-network`
- **Service Discovery**: Container names as hostnames
- **Protocol**: HTTP/2 with gRPC
- **Load Balancing**: Not implemented (single instance per service)

## 🧪 Testing

### Integration Testing

Run the automated test script:

```bash
node test.js
```

### Expected Results for Complex Expressions

```
✅ Simple: 2 + 3 = 5 (Python)
✅ Precedence: 2 + 3 * 4 = 14 (Python + C++)
✅ Parentheses: (2 + 3) * 4 = 20 (Python + C++)
✅ Decimals: 3.14 * 2 = 6.28 (C++)
✅ Modulus: 10 % 3 = 1 (Go)
✅ Power: 2^3 = 8 (Elixir)
✅ Complex: (5 + 3) * 2^2 - 10 % 3 = 31 (All services)
```

## 🚨 Error Handling

Each service implements robust error handling:

- **Input Validation**: Parameter checking and type validation
- **Division by Zero**: Rust service returns appropriate gRPC error status
- **Invalid Expressions**: Client validates expressions before parsing
- **Connection Timeouts**: Client-side timeout handling for all services
- **Service Discovery**: Container-to-container communication with retry logic
- **Parsing Errors**: AST parser handles malformed expressions gracefully

## 🔐 Security Considerations

- **Current**: Insecure gRPC (for development and demonstration)
- **Production Ready**: Would need TLS/SSL encryption for all gRPC channels
- **Authentication**: No auth implemented (add JWT/OAuth for production)
- **Network**: Services isolated in Docker network (calculator-network)
- **Input Validation**: All services validate inputs to prevent injection attacks

## 📈 Performance Characteristics

| Service | Language | Startup Time | Memory Usage | Binary Size | Concurrency Model  |
| ------- | -------- | ------------ | ------------ | ----------- | ------------------ |
| Python  | Python   | ~2s          | ~50MB        | N/A         | Threading          |
| Java    | Java     | ~3s          | ~100MB       | ~15MB JAR   | Thread Pool        |
| C++     | C++      | ~1s          | ~10MB        | ~2MB        | Thread Pool        |
| Rust    | Rust     | ~1s          | ~5MB         | ~8MB        | Async (Tokio)      |
| Go      | Go       | ~1s          | ~15MB        | ~12MB       | Goroutines         |
| Elixir  | Elixir   | ~2s          | ~25MB        | N/A         | Actor Model (BEAM) |
| Node.js | Node.js  | ~1s          | ~30MB        | N/A         | Event Loop         |

## 🎓 Learning Outcomes

This project demonstrates:

### Polyglot Programming

- **Language Strengths**: Each language showcases its unique strengths
  - Python: Simplicity and rapid development
  - Java: Enterprise robustness and tooling
  - C++: Performance and system-level control
  - Rust: Memory safety and concurrency
  - Go: Simplicity and built-in concurrency
  - Elixir: Fault tolerance and distributed systems
  - Node.js: Event-driven architecture and JavaScript ecosystem

### Distributed Systems Concepts

- **Service Mesh**: Inter-service communication patterns
- **Protocol Buffers**: Language-agnostic serialization
- **gRPC**: Modern RPC framework with HTTP/2
- **Container Orchestration**: Docker Compose service management
- **Dependency Management**: Service startup ordering

### Computer Science Fundamentals

- **Abstract Syntax Trees**: Expression parsing and evaluation
- **Operator Precedence**: Mathematical expression handling
- **Parallel Processing**: Concurrent evaluation of independent operations
- **Client-Server Architecture**: Request-response patterns

## 🔮 Future Enhancements

- **C# Service**: Add power operations (`**`) using .NET
- **Kubernetes Deployment**: Production-ready orchestration

---

**Built to demonstrate the power of polyglot microservices architecture**
