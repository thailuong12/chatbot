FROM node:carbon

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Copy dependency definitions
COPY . /usr/src/app

# Install dependecies
RUN cd /server/ \
    && npm install \
    && cd .. \
    && cd /angular/ \
    && npm install \
    && ng build \
    && cd .. \
    && cd /server/
# Expose the port the app runs in
EXPOSE 8080

# Serve the app
CMD ["npm", "start"]
