# Step 1: Use the official Node.js image as a base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

# Step 4: Install the dependencies
RUN npm i -g pnpm && pnpm install --prod

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the Next.js app (for production)
RUN npm run build

# Step 7: Expose the port on which the Next.js app will run
EXPOSE 3002

# Step 8: Set the default command to start the Next.js app
CMD ["npm", "start"]
