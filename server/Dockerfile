# base image: We use "alpine", a highly stripped-down, lightweight Linux OS. 
# keeps the container size incredibly small, saving Azure deployment time.
FROM node:20-alpine

# set the working directory inside the container. everything we do from now on happens inside this folder.
WORKDIR /app

# copy only the package files first.
# docker caches layers. by copying these first, docker will only re-run the time-consuming 'npm install' step if you actually add a new dependency.
COPY package*.json ./

# install dependencies. 
# we use 'npm ci' (clean install) instead of 'npm install' to strictly follow package-lock.json to not accidentally upgrade packages in production.
RUN npm ci --only=production

# copy the rest of the server's source code into the container.
COPY . .

# expose the port the Express server runs on (default is 5000). 
EXPOSE 5000

# start the server.
CMD ["npm", "start"]