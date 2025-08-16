$BUILD_DIR = "build"
$VCPKG_TOOLCHAIN = $env:VCPKG_ROOT + "\scripts\buildsystems\vcpkg.cmake"

# Ensure the build directory exists
if (-not (Test-Path -Path $BUILD_DIR)) {
    Write-Host "Creating build directory: $BUILD_DIR"
    New-Item -ItemType Directory -Path $BUILD_DIR
}
else {
    Write-Host "Build directory already exists: $BUILD_DIR"
}

# cd into the build directory
Write-Host "Changing directory to: $BUILD_DIR"
Push-Location $BUILD_DIR

try {
    Write-Host "Configuring CMake with VCPKG toolchain..."
    cmake .. "-DCMAKE_TOOLCHAIN_FILE=$VCPKG_TOOLCHAIN"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "CMake configuration failed. Please check the output for errors."
        Pop-Location
        exit 1
    }
    else {
        Write-Host "CMake configuration successful."
    }
    
    Write-Host "Building the project..."
    cmake --build . --config Release

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed. Please check the output for errors."
        Pop-Location
        exit 1
    }
    else {
        Write-Host "Build completed successfully."
        Write-Host "You can find the built binaries in the $BUILD_DIR/Release/ folder."
    }
}
catch {
    <#Do this if a terminating exception happens#>
    Write-Host "An error occurred: $_"
    Pop-Location
    exit 1
}

