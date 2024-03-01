# PideCola Node Backend

This repository contains the NodeJS and Express service of the PideCola API.

## Deploy

Executing `docker compose up` at the root directory of the project should instantiate a docker container with a production build of the web app and a container with a Mongo service running.

## Development

### Requirements

To set up the development environment, you'll need:

- NodeJS (recommended version 20).
- NPM.
- Mongo running on your system.

### Installation

Clone the repository and install the dependencies using `npm`:

```sh
git clone https://github.com/ChuyB/pidecola-backend
```

```sh
cd pidecola-backend
```

```sh
npm install
```

### Local deployment

Before running `npm run dev`, it's essential to set the environment variables. The `.env.example` file contains the necessary environment variables, which include:

- KEY: API secret. It must match the one set in the client environment variables.
- PORT: API default connection port.
- MONGODB_URL: MongoDB connection URI.
- DB_NAME: Name of the Mongo database.
- AUDIENCE: Service domain name.
- EMAIL_USER: Email address of the account sending the confirmation codes.
- EMAIL_PASS: Email account password.

Once the environment variables are set, you can start the service running one of the following commands:

```sh
npm run dev
```

```sh
npm start
```

## Testing

Tests can be run by executing the following command:

```sh
npm test
```
