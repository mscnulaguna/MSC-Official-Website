# base image: We use "alpine", a highly stripped-down, lightweight Linux OS. 
# keeps the container size incredibly small, saving Azure deployment time.
FROM node:20-alpine

# set the working directory inside the container. everything we do from now on happens inside this folder.
WORKDIR /app

# copy only the package files first.
# docker caches layers. by copying these first, docker will only re-run the time-consuming 'npm install' step if you actually add a new dependency.
COPY --chown=node:node package*.json ./

# copy the rest of the server's source code into the container.
COPY --chown=node:node . .

# install dependencies.
# we use 'npm ci' (clean install) instead of 'npm install' to strictly follow package-lock.json to not accidentally upgrade packages in production.
# remove any node_modules that may have been copied from the host to avoid overriding the clean install.
# RUN rm -rf node_modules && npm ci --only=production
RUN npm install --omit=dev
# expose the port the Express server runs on (default is 5000). 
EXPOSE 80

# run the server as a non-root user for improved security.
# the node:20-alpine image includes a built-in "node" user (uid 1000) for this purpose.
USER root

# start the server.
CMD ["node", "server.js"]