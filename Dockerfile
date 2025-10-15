FROM ollama/ollama:latest

# Install curl and unzip
USER root
RUN apt-get update && apt-get install -y curl unzip

# Install Bun (if needed)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

EXPOSE 11434
ENV OLLAMA_HOST=0.0.0.0
# The start command will be handled by railway.toml
