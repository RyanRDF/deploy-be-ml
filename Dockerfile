# Step 1: Use an official Node.js runtime as the base image
FROM node:18-slim

# Step 2: Install system dependencies for TensorFlow and Python
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    build-essential

# Step 3: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 4: Copy package.json and package-lock.json (if exists) into the container
COPY package*.json ./ 

# Step 5: Install app dependencies
RUN npm install --production

# Step 6: Create a virtual environment for Python and install TensorFlow
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install tensorflow

# Step 7: Copy the entire `src` directory into the container
COPY ./src ./src

# Step 8: Expose the port that your app will run on
EXPOSE 8080

# Step 9: Set environment variable to use the virtual environment for Python
ENV PATH="/opt/venv/bin:$PATH"

# Step 10: Define the command to run the application
CMD ["npm", "start"]