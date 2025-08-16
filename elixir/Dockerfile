FROM elixir:1.16-alpine
WORKDIR /app

# Install system dependencies including git
RUN apk add --no-cache git

# Install hex and rebar first
RUN mix local.hex --force && mix local.rebar --force

# Copy dependency files first for better caching
COPY elixir/mix.exs ./

# Install dependencies (this will create mix.lock if it doesn't exist)
RUN mix deps.get

# Copy the rest of the elixir application
COPY elixir/ .

# Compile the application
RUN mix compile

# Expose the gRPC port
EXPOSE 50056

# Use the start alias which handles dependencies and compilation
CMD ["mix", "start"]
