# Dockerfile for Astro + Node.js on Fly.io
FROM node:22

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm, install deps without running scripts, then rebuild native modules
RUN npm install -g pnpm && pnpm install --frozen-lockfile --ignore-scripts && pnpm rebuild

# Copy source code
COPY . .

# Build the Astro app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "./dist/server/entry.mjs"]

# Start the server
CMD ["node", "./dist/server/entry.mjs"]
