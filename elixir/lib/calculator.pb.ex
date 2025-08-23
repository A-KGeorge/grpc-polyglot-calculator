defmodule Calculator.TwoNumbers do
  @moduledoc false

  use Protobuf, protoc_gen_elixir_version: "0.15.0", syntax: :proto3

  field :a, 1, type: :double
  field :b, 2, type: :double
end

defmodule Calculator.Number do
  @moduledoc false

  use Protobuf, protoc_gen_elixir_version: "0.15.0", syntax: :proto3

  field :result, 1, type: :double
end
