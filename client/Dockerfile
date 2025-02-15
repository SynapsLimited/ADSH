# Use a Node image based on Debian Buster which allows installing additional packages
FROM node:16-buster

# Install required libraries for Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libgbm1 \
    libasound2

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app’s code
COPY . .

# Build the CRA app (which will run react-snap via the postbuild script)
RUN npm run build

# Serve the build folder (you can use a lightweight static file server)
RUN npm install -g serve
CMD ["serve", "-s", "build"]
