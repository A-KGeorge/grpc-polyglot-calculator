import grpc
from concurrent import futures
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'generated'))

import calculator_pb2
import calculator_pb2_grpc

class Calculator(calculator_pb2_grpc.CalculatorServicer):
    def Add(self, request, context):
        return calculator_pb2.Number(result=request.a + request.b)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    calculator_pb2_grpc.add_CalculatorServicer_to_server(Calculator(), server)
    
    server.add_insecure_port('0.0.0.0:50051')
    server.start()
    print("Python Add server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()