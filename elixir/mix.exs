defmodule Calculator.MixProject do
  use Mix.Project

  def project do
    [
      app: :calculator,
      version: "0.1.0",
      elixir: "~> 1.16",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Calculator, []}
    ]
  end

  defp deps do
    [
      # gRPC implementation
      {:grpc, github: "elixir-grpc/grpc"},
      # Protobuf support
      {:protobuf, "~> 0.14.0"}
    ]
  end

  defp aliases do
    [
      # Run the server
      server: "run --no-halt",
      # Compile and run
      start: ["deps.get", "compile", "run --no-halt"],
      # Development server with recompilation
      dev: "run --no-halt"
    ]
  end
end
