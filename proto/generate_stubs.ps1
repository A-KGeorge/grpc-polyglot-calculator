#
# This script compiles the 'calculator.proto' file for C++, Python, Java, and Node.js.
# using the Protocol Buffers and gRPC tools.

$CPP_OUTPUT_DIR = "..\cpp\generated"
$PYTHON_OUTPUT_DIR = "..\python\generated"
$JAVA_OUTPUT_DIR = "..\java"
$GO_OUTPUT_DIR = "..\go\generated"
$ELIXIR_OUTPUT_DIR = "..\elixir\lib"
$NODE_OUTPUT_DIR = "..\node\generated"

# Ensure the output directories exist
if (-not (Test-Path -Path $CPP_OUTPUT_DIR)) {
    Write-Host "Creating output directory: $CPP_OUTPUT_DIR"
    New-Item -ItemType Directory -Path $CPP_OUTPUT_DIR
}
if (-not (Test-Path -Path $PYTHON_OUTPUT_DIR)) {
    Write-Host "Creating output directory: $PYTHON_OUTPUT_DIR"
    New-Item -ItemType Directory -Path $PYTHON_OUTPUT_DIR
}
if (-not (Test-Path -Path $JAVA_OUTPUT_DIR)) {
    Write-Host "Creating output directory: $JAVA_OUTPUT_DIR"
    New-Item -ItemType Directory -Path $JAVA_OUTPUT_DIR
}
if (-not (Test-Path -Path $GO_OUTPUT_DIR)) {
    Write-Host "Creating output directory: $GO_OUTPUT_DIR"
    New-Item -ItemType Directory -Path $GO_OUTPUT_DIR
}
if (-not (Test-Path -Path $ELIXIR_OUTPUT_DIR)) {
    Write-Host "Creating output directory: $ELIXIR_OUTPUT_DIR"
    New-Item -ItemType Directory -Path $ELIXIR_OUTPUT_DIR
}
if (-not (Test-Path -Path $NODE_OUTPUT_DIR)) {
    Write-Host "Creating output directory: $NODE_OUTPUT_DIR"
    New-Item -ItemType Directory -Path $NODE_OUTPUT_DIR
}


# --- C++ Compilation ---
#
# Find the path to the `grpc_cpp_plugin` executable.
# This script first checks for a vcpkg installation and then falls back to a global search.
#

# Check if the protoc command is available and prefer vcpkg version
$protocPath = ""
if ($env:VCPKG_ROOT) {
    $vcpkgProtocPath = Join-Path -Path $env:VCPKG_ROOT -ChildPath "installed\x64-windows\tools\protobuf\protoc.exe"
    if (Test-Path $vcpkgProtocPath) {
        $protocPath = $vcpkgProtocPath
        Write-Host "Using vcpkg protoc: $protocPath"
    }
}

if (-not $protocPath) {
    if (-not (Get-Command protoc -ErrorAction SilentlyContinue)) {
        Write-Error "The 'protoc' command is not available. Please ensure Protocol Buffers is installed and added to your PATH."
        exit 1
    }
    $protocPath = "protoc"
    Write-Host "Using system protoc: $protocPath"
}


try {
    $grpcPluginPath = ""
    # Check if the VCPKG_ROOT environment variable is set
    if ($env:VCPKG_ROOT) {
        # Construct the path to the gRPC plugin based on the vcpkg installation
        # This assumes a standard x64-windows triplet.
        $pluginCandidatePath = Join-Path -Path $env:VCPKG_ROOT -ChildPath "installed\x64-windows\tools\grpc\grpc_cpp_plugin.exe"
        if (Test-Path $pluginCandidatePath) {
            $grpcPluginPath = $pluginCandidatePath
            Write-Host "Found gRPC plugin via vcpkg: $grpcPluginPath"
        }
    }

    # If the plugin wasn't found via vcpkg, try a global search
    if (-not $grpcPluginPath) {
        # Use Get-Command to search the system's PATH
        $grpcPluginPath = (Get-Command grpc_cpp_plugin).Path
        Write-Host "Found gRPC plugin in PATH: $grpcPluginPath"
    }

    if ($grpcPluginPath) {
        # Run the protoc command for C++
        Write-Host "Compiling calculator.proto for C++..."
        # FIX: The --cpp_out parameter has been changed to point to the $CPP_OUTPUT_DIR directory.
        # This ensures that calculator.pb.cc and calculator.pb.h are generated in the correct folder.
        & $protocPath -I . calculator.proto --cpp_out=$CPP_OUTPUT_DIR --grpc_out=$CPP_OUTPUT_DIR --plugin=protoc-gen-grpc="$grpcPluginPath"
        Write-Host "C++ compilation complete."
        Write-Host "Generated files are located in: $CPP_OUTPUT_DIR"
    }
    else {
        # If the path is still not found, throw an error
        throw "Could not find 'grpc_cpp_plugin'. Please ensure it's in your system's PATH or that VCPKG_ROOT is set correctly."
    }
}
catch {
    Write-Error "Error: $_.Exception.Message"
    exit 1
}


# --- Python Compilation ---
#
# This command uses the Python gRPC tools module to compile the
# protocol buffer.
#

# Check if the grpc_tools module is available for Python
try {
    python -c "import grpc_tools" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "The 'grpc_tools' module is not available. Please install it using 'pip install grpcio-tools'."
        exit 1
    }
}
catch {
    Write-Error "The 'grpc_tools' module is not available. Please install it using 'pip install grpcio-tools'."
    exit 1
}

Write-Host "Compiling calculator.proto for Python..."
# FIX: The --grpc_python_out parameter has been changed to point to the $PYTHON_OUTPUT_DIR directory.
# This ensures that calculator_pb2_grpc.py is generated in the correct folder.
python -m grpc_tools.protoc -I. --python_out=$PYTHON_OUTPUT_DIR --grpc_python_out=$PYTHON_OUTPUT_DIR calculator.proto
Write-Host "Python compilation complete."
Write-Host "Generated files are located in: $PYTHON_OUTPUT_DIR"


# --- Java Compilation ---
#
# Generate Java stubs using Maven protobuf plugin
#

# Ensure Maven is installed and available in PATH
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Error "The 'mvn' command is not available. Please ensure Maven is installed and added to your PATH."
    exit 1
}

# Generate Java stubs using Maven
try {
    Write-Host "Generating Java stubs using Maven..."
    Set-Location "..\java"
    
    # Copy the proto file to the correct Maven location
    $protoDir = "src\main\proto"
    if (-not (Test-Path -Path $protoDir)) {
        New-Item -ItemType Directory -Path $protoDir -Force
    }
    Copy-Item "..\proto\calculator.proto" "$protoDir\calculator.proto" -Force

    # Run Maven to generate stubs
    mvn protobuf:compile protobuf:compile-custom
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Java stub generation complete."
    }
    else {
        throw "Maven protobuf compilation failed."
    }
    
    Set-Location "..\proto"

    Write-Host "Java stubs generated successfully."
    Write-Host "Generated files are located in: .\java\target\generated-sources\protobuf"
}
catch {
    Write-Error "Error generating Java stubs: $_.Exception.Message"
    Set-Location "..\proto"
    exit 1
}

# --- Golang Compilation ---
#
# This section generates Go stubs using protoc-gen-go and protoc-gen-go-grpc
#

# Check if protoc is available
if (-not (Get-Command protoc -ErrorAction SilentlyContinue)) {
    Write-Error "The 'protoc' command is not available. Please ensure Protocol Buffers is installed and added to your PATH."
    exit 1
}

# Check if Go plugins are available
$goPluginMissing = $false
if (-not (Get-Command protoc-gen-go -ErrorAction SilentlyContinue)) {
    Write-Host "protoc-gen-go not found. Install with: go install google.golang.org/protobuf/cmd/protoc-gen-go@latest"
    $goPluginMissing = $true
}

if (-not (Get-Command protoc-gen-go-grpc -ErrorAction SilentlyContinue)) {
    Write-Host "protoc-gen-go-grpc not found. Install with: go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest"
    $goPluginMissing = $true
}

if ($goPluginMissing) {
    Write-Error "Go protobuf/gRPC plugins are missing. Please install them first."
    exit 1
}

# Generate Go stubs
try {
    Write-Host "Compiling calculator.proto for Go..."
    
    # Generate protobuf Go code
    & protoc -I. --go_out=$GO_OUTPUT_DIR --go_opt=paths=source_relative calculator.proto

    # Generate gRPC Go code
    & protoc -I. --go-grpc_out=$GO_OUTPUT_DIR --go-grpc_opt=paths=source_relative calculator.proto

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Go compilation complete."
        Write-Host "Generated files are located in: $GO_OUTPUT_DIR"
    }
    else {
        throw "Go protobuf compilation failed."
    }
}
catch {
    Write-Error "Error generating Go stubs: $_.Exception.Message"
    exit 1
}

# --- Elixir Compilation ---
#
# This section generates Elixir stubs using protoc with protoc-gen-elixir
#

# Check if protoc is available
if (-not (Get-Command protoc -ErrorAction SilentlyContinue)) {
    Write-Error "The 'protoc' command is not available. Please ensure Protocol Buffers is installed and added to your PATH."
    exit 1
}

# Check if protoc-gen-elixir is available
if (-not (Get-Command protoc-gen-elixir -ErrorAction SilentlyContinue)) {
    Write-Host "protoc-gen-elixir not found. Please install protobuf-elixir in your Elixir project."
    Write-Host "Add to mix.exs: {:protobuf, '~> 0.11'}, {:grpc, '~> 0.7'}"
    Write-Host "Then run: mix deps.get && mix escript.install hex protobuf"
    Write-Error "Elixir protobuf plugin is missing."
    exit 1
}

# Generate Elixir stubs
try {
    Write-Host "Compiling calculator.proto for Elixir..."

    # Generate only protobuf files (not gRPC) as the grpc plugin might not be available
    & protoc -I. --elixir_out=$ELIXIR_OUTPUT_DIR calculator.proto

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Elixir protobuf compilation complete."
        Write-Host "Generated files are located in: $ELIXIR_OUTPUT_DIR"
        Write-Host "Note: For gRPC support, you may need to manually configure the Elixir gRPC client in your project."
    }
    else {
        throw "Elixir protobuf compilation failed."
    }
}
catch {
    Write-Error "Error generating Elixir stubs: $_.Exception.Message"
    exit 1
}


# --- Node.js Compilation ---
#
# This section generates Node.js stubs using grpc-tools
#

# Check if Node.js is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "The 'node' command is not available. Please ensure Node.js is installed and added to your PATH."
    exit 1
}

# Check if npm is available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "The 'npm' command is not available. Please ensure npm is installed and added to your PATH."
    exit 1
}

# Check if grpc-tools is installed globally or locally
$grpcToolsPath = ""
try {
    # First try to find grpc_tools_node_protoc in global npm modules
    $globalNpmPath = npm root -g 2>$null
    if ($LASTEXITCODE -eq 0) {
        $globalGrpcTools = Join-Path -Path $globalNpmPath -ChildPath "grpc-tools\bin\grpc_tools_node_protoc.cmd"
        if (Test-Path $globalGrpcTools) {
            $grpcToolsPath = $globalGrpcTools
            Write-Host "Found grpc-tools globally: $grpcToolsPath"
        }
    }
    
    # If not found globally, check locally in node directory
    if (-not $grpcToolsPath) {
        $localGrpcTools = "..\node\node_modules\.bin\grpc_tools_node_protoc.cmd"
        if (Test-Path $localGrpcTools) {
            $grpcToolsPath = $localGrpcTools
            Write-Host "Found grpc-tools locally: $grpcToolsPath"
        }
    }
    
    # If still not found, try to install it locally
    if (-not $grpcToolsPath) {
        Write-Host "grpc-tools not found. Installing locally..."
        Set-Location "..\node"
        
        # Initialize package.json if it doesn't exist
        if (-not (Test-Path "package.json")) {
            npm init -y
        }
        
        npm install grpc-tools @grpc/grpc-js @grpc/proto-loader
        
        $grpcToolsPath = ".\node_modules\.bin\grpc_tools_node_protoc.cmd"
        if (Test-Path $grpcToolsPath) {
            Write-Host "grpc-tools installed successfully: $grpcToolsPath"
        }
        else {
            throw "Failed to install grpc-tools"
        }
        
        Set-Location "..\proto"
    }
}
catch {
    Write-Error "Error setting up grpc-tools: $_.Exception.Message"
    exit 1
}

# Generate Node.js stubs
try {
    Write-Host "Compiling calculator.proto for Node.js..."
    
    # Generate JavaScript files
    if ($grpcToolsPath.StartsWith("..\node\")) {
        $currentDir = Get-Location
        Set-Location "..\node"
        $fullGrpcToolsPath = Join-Path (Get-Location) "node_modules\.bin\grpc_tools_node_protoc.cmd"
        $jsOutParam = "--js_out=import_style=commonjs,binary:.\generated"
        $grpcOutParam = "--grpc_out=grpc_js:.\generated"
        & $fullGrpcToolsPath $jsOutParam $grpcOutParam --proto_path=..\proto ..\proto\calculator.proto
        Set-Location $currentDir
    }
    else {
        $jsOutParam = "--js_out=import_style=commonjs,binary:$NODE_OUTPUT_DIR"
        $grpcOutParam = "--grpc_out=grpc_js:$NODE_OUTPUT_DIR"
        & $grpcToolsPath $jsOutParam $grpcOutParam --proto_path=. calculator.proto
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js compilation complete."
        Write-Host "Generated files are located in: $NODE_OUTPUT_DIR"
    }
    else {
        throw "Node.js protobuf compilation failed."
    }
}
catch {
    Write-Error "Error generating Node.js stubs: $_.Exception.Message"
    exit 1
}
