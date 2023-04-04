#
# ---- Base ----
#
FROM node:16.13.2-slim AS base
LABEL version=1.0.0
RUN adduser --disabled-password --gecos "" sleiter --home /opt/sleiter --uid 1337
RUN mkdir /opt/sleiter/app && chown -R sleiter:sleiter /opt/sleiter/app
WORKDIR /opt/sleiter/app
COPY --chown=sleiter:sleiter ./package.json ./package-lock.json ./

#
# ---- Build ----
#
FROM base AS build
COPY --chown=sleiter:sleiter . .
# Install all dependencies for build
RUN npm install
RUN npm run build

#
# ---- Dependencies ----
#
FROM base AS dependencies
# Save production dependencies for deployment
RUN npm install --prod

#
# ---- Release ----
#
FROM base AS release
USER sleiter

# Get production dependencies
COPY --from=dependencies --chown=sleiter:sleiter /opt/sleiter/app/node_modules ./node_modules

# Get build
COPY --from=build --chown=sleiter:sleiter /opt/sleiter/app/dist ./dist

# switch to this user
USER root

# libraries 
RUN apt-get update 
RUN apt-get install -y tesseract-ocr && apt-get install -y libtesseract-dev

USER sleiter

# Start application
CMD ["node", "dist/app"]


