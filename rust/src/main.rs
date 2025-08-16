use tonic::{transport::Server, Request, Response, Status};

// Include the generated proto code
pub mod calculator {
    tonic::include_proto!("calculator");
}

use calculator::calculator_server::{Calculator, CalculatorServer};
use calculator::{Number, TwoNumbers};

#[derive(Default)]
pub struct DivisionServer;

#[tonic::async_trait]
impl Calculator for DivisionServer {
    async fn add(&self, request: Request<TwoNumbers>) -> Result<Response<Number>, Status> {
        let TwoNumbers { a, b } = request.into_inner();
        Ok(Response::new(Number { result: a + b }))
    }

    async fn subtract(&self, request: Request<TwoNumbers>) -> Result<Response<Number>, Status> {
        let TwoNumbers { a, b } = request.into_inner();
        Ok(Response::new(Number { result: a - b }))
    }

    async fn multiply(&self, request: Request<TwoNumbers>) -> Result<Response<Number>, Status> {
        let TwoNumbers { a, b } = request.into_inner();
        Ok(Response::new(Number { result: a * b }))
    }

    async fn divide(&self, request: Request<TwoNumbers>) -> Result<Response<Number>, Status> {
        let TwoNumbers { a, b } = request.into_inner();
        if b == 0.0 {
            return Err(Status::invalid_argument("Division by zero is not allowed"));
        }
        Ok(Response::new(Number { result: a / b }))
    }

    async fn modulus(&self, request: Request<TwoNumbers>) -> Result<Response<Number>, Status> {
        let TwoNumbers { a, b } = request.into_inner();
        if b == 0.0 {
            return Err(Status::invalid_argument("Division by zero is not allowed"));
        }
        Ok(Response::new(Number { result: a % b }))
    }

    async fn exponentiate(&self, request: Request<TwoNumbers>) -> Result<Response<Number>, Status> {
        let TwoNumbers { a, b } = request.into_inner();
        Ok(Response::new(Number { result: a.powf(b) }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50054".parse()?;

    println!("Division Server listening on {}", addr);

    Server::builder()
        .add_service(CalculatorServer::new(DivisionServer::default()))
        .serve(addr)
        .await?;
    Ok(())
}
