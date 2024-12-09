FROM node:20.10.0-alpine

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

# Run the application as a non-root user.
# USER node # consider for security when in production

# Copy everything from current directory into wd inside image
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm run dev
