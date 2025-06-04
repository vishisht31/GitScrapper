# Use official Node.js LTS image
FROM node:18

# Create app directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source code
COPY . .

# Expose the port your app listens on (replace 3000 if different)
EXPOSE 3000

# Start your app
CMD ["node", "app.js"]
