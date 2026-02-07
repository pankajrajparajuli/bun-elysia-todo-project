# Use official Bun image
FROM oven/bun:latest

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Expose port for backend
EXPOSE 3000

# Run Bun in watch mode (auto reload)
CMD ["bun", "run", "dev"]
