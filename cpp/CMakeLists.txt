cmake_minimum_required(VERSION 3.15)
project(grpc_server_example CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find the dependencies managed by vcpkg
find_package(gRPC CONFIG REQUIRED)
find_package(Protobuf CONFIG REQUIRED)

# Add the generated proto files as a library
add_library(proto_lib
    generated/calculator.pb.cc
    generated/calculator.grpc.pb.cc
)

# Include directories for the generated files
target_include_directories(proto_lib PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/
    ${CMAKE_CURRENT_SOURCE_DIR}/generated
)

# Link the proto library with gRPC and Protobuf
target_link_libraries(proto_lib
    gRPC::grpc++
    protobuf::libprotobuf
)

# Add the server executable
add_executable(multiply_server multiply_server.cc)

# Link the server executable with the proto library
target_link_libraries(multiply_server PRIVATE
    gRPC::grpc++
    gRPC::grpc++_reflection
    protobuf::libprotobuf    
    proto_lib
)