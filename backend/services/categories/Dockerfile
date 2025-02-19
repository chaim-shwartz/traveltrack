FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose application port
EXPOSE ${SERVICE_PORT:-4000}

# Set environment-specific variables (default: production)
ENV NODE_ENV=${NODE_ENV:-production}

# Define the command dynamically based on NODE_ENV
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'development' ]; then npm run dev; else node app.js; fi"]