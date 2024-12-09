FROM node:20.10.0-alpine
# RUN useradd -ms /bin/sh -u 1001 app
# USER app

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

# Copy the rest of the source files into the image.
# COPY --chown=app:app . /usr/src/app/
COPY . .

# Expose the port that the application listens on.
EXPOSE 5173

# Run the application.
CMD npm run dev

