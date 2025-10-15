FROM ollama/ollama:latest

# Install curl and unzip
USER root
RUN apt-get update && apt-get install -y curl unzip

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Copy your monorepo code
WORKDIR /app
COPY . .

# Install client dependencies and build client if it exists
WORKDIR /app/packages/client
RUN bun install && bun run build || true

# Install server dependencies
WORKDIR /app/packages/server
RUN bun install

EXPOSE 11434
ENV OLLAMA_HOST=0.0.0.0

# Start command will be handled by railway.toml or the Railway deployment start command
