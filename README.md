## Design Decisions
Used NestJS for its modular structure and support for WebSocket and MongoDB.
Containerized the application for easy setup and consistency across environments.
Used Jest for comprehensive unit testing.

## Requirements
 - pnpm
 - Docker & Docker Compose
 - node.js at least version 18

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test
1. install dependencies
2. run test using below commands
```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e
```

# Docker
To run docker version simply run `docker-compose up`. This will start the app and mongodb services. 
The application will be available at http://localhost:3000.