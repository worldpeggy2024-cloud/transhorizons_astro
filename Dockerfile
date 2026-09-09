# Dockerfile for Astro + Node.js on Fly.io
FROM node:22

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm, install deps without running scripts, then rebuild native modules.
#
# PIN THE PNPM VERSION. This line used to read `npm install -g pnpm`, which takes
# whatever is newest at build time — so an upstream pnpm release could (and on
# 2026-09-09 did) break a deploy with no change to this repo: pnpm 12 turned
# unapproved build scripts (esbuild, sharp) into a hard ERR_PNPM_IGNORED_BUILDS
# failure during `pnpm rebuild`. Keep this matched to the version used locally,
# so the image builds what was actually tested.
RUN npm install -g pnpm@10.33.0 && pnpm install --frozen-lockfile --ignore-scripts && pnpm rebuild

# Copy source code
COPY . .

# Build the Astro app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Set environment for Astro Node adapter
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the server
CMD ["node", "./dist/server/entry.mjs"]
