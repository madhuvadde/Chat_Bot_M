FROM ollama/ollama:latest

# Expose Ollama's default API port
EXPOSE 11434

# Set environment variables (optional)
ENV OLLAMA_HOST=0.0.0.0

# The start command will be handled by railway.toml
