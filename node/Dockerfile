# Node.js Client Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY node/package.json ./
RUN npm install

# Copy the client source code
COPY node/src/ ./src/
COPY node/generated/ ./generated/

# Create proto directory structure and copy proto file
RUN mkdir -p ../proto
COPY proto/calculator.proto ../proto/

EXPOSE 3000

CMD ["npm", "start"]
