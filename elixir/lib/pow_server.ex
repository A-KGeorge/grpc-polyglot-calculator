defmodule Calculator.Service do
  use GRPC.Service, name: "calculator.Calculator", protoc_gen_elixir_version: "0.15.0"

  rpc(:Add, Calculator.TwoNumbers, Calculator.Number)
  rpc(:Subtract, Calculator.TwoNumbers, Calculator.Number)
  rpc(:Multiply, Calculator.TwoNumbers, Calculator.Number)
  rpc(:Divide, Calculator.TwoNumbers, Calculator.Number)
  rpc(:Modulus, Calculator.TwoNumbers, Calculator.Number)
  rpc(:Exponentiate, Calculator.TwoNumbers, Calculator.Number)
end

defmodule Calculator.PowServer do
  use GRPC.Server, service: Calculator.Service

  @spec exponentiate(Calculator.TwoNumbers.t(), GRPC.Server.Stream.t()) ::
          Calculator.Number.t()
  def exponentiate(%Calculator.TwoNumbers{a: a, b: b}, _stream) do
    result = :math.pow(a, b)
    %Calculator.Number{result: result}
  end
end
