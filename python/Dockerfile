# Python Add Server Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY python/ .
COPY proto/calculator.proto ./

RUN pip install grpcio grpcio-tools && \
    python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. calculator.proto

EXPOSE 50051

CMD ["python", "add_server.py"]
