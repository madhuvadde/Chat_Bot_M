FROM ollama/ollama:latest

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

EXPOSE 11434
ENV OLLAMA_HOST=0.0.0.0
# The start command should be handled by railway.toml
