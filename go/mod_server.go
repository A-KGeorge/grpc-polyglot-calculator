package main

import (
	"context"
	"log"
	"net"

	pb "calculator/generated"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedCalculatorServer
}

func (s *server) Modulus(ctx context.Context, in *pb.TwoNumbers) (*pb.Number, error) {
	a := int64(in.A) // use floor/convert since proto is double
	b := int64(in.B)
	if b == 0 {
		return &pb.Number{Result: 0}, nil
	}
	return &pb.Number{Result: float64(a % b)}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50055")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterCalculatorServer(grpcServer, &server{})
	log.Println("Go Modulo server listening on port :50055")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
