# Dockerfile for Astro + Node.js on Fly.io
FROM node:22

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with npm
RUN npm install

# Copy source code
COPY . .

# Build the Astro app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "./dist/server/entry.mjs"]
