# Use an official NodeJs runtime as a parent image
FROM node:22-alpine
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json files to the container
COPY package*.json .
# Install dependencies
RUN npm install

# COPY the rest of the application code

COPY . .

RUN npx prisma generate

# Expose the port that the app will run on
EXPOSE 5000

# Define the command to run the application

CMD ["node","./src/server.js"]

