defmodule Calculator do
  use Application

  def start(_type, _args) do
    IO.puts("Starting Elixir exponentiate gRPC server on port 50056...")

    children = [
      {GRPC.Server.Supervisor, endpoint: Calculator.Endpoint, port: 50056, start_server: true}
    ]

    opts = [strategy: :one_for_one, name: Calculator.Supervisor]

    case Supervisor.start_link(children, opts) do
      {:ok, pid} ->
        IO.puts("Elixir exponentiate gRPC server successfully started on port 50056")
        {:ok, pid}

      {:error, reason} ->
        IO.puts("Failed to start gRPC server: #{inspect(reason)}")
        {:error, reason}
    end
  end
end

defmodule Calculator.Endpoint do
  use GRPC.Endpoint

  run(Calculator.PowServer)
end
