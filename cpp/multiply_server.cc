#include <iostream>
#include <string>
#include <memory>

#include <grpcpp/grpcpp.h>
#include "calculator.grpc.pb.h"

class MultiplyServiceImpl final : public calculator::Calculator::Service
{
    grpc::Status Multiply(grpc::ServerContext *context, const calculator::TwoNumbers *req, calculator::Number *res) override
    {
        res->set_result(req->a() * req->b());
        return grpc::Status::OK;
    }
};

int main()
{
    std::string addr("0.0.0.0:50053");
    MultiplyServiceImpl service;

    grpc::ServerBuilder builder;
    builder.AddListeningPort(addr, grpc::InsecureServerCredentials());
    builder.RegisterService(&service);
    std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
    if (server == nullptr)
    {
        std::cerr << "Failed to start server" << std::endl;
        return 1;
    }
    std::cout << "Multiply server listening on " << addr << std::endl;
    server->Wait();
    return 0;
}