# Step 1: Use the official Node.js image as a base image
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

# Step 4: Install the dependencies
RUN npm i -g pnpm && pnpm install --prod

# Step 5: Copy the rest of the application code to the container
COPY . /app


FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules

# Step 7: Expose the port on which the Next.js app will run
EXPOSE 3002

# Step 8: Set the default command to start the Next.js app
CMD ["pnpm", "start"]
