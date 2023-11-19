FROM node:12.20-alpine

USER root

WORKDIR /app

# Install the prerequisites
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python3 krb5 krb5-libs gcc make g++ krb5-dev zeromq-dev

# Copy the package.json file to the container
COPY ./package*.json .

RUN npm install

# Copy the rest of the files to the container
COPY . .

# Expose port 80
EXPOSE 80

# set default command
CMD ["npm", "start"]
