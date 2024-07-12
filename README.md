# File to GPT

This project allows you to input files as the source of truth for an AI to base its responses on.

## Prerequisites

- Node.js (version 20 or higher)
- npm (version 10 or higher)
- Docker (optional)

## Setup

### Clone the Repository

```sh
git clone https://github.com/your-username/file-to-gpt.git
cd file-to-gpt
```

### Set Up Environment Variables

```sh
cp .env.example .env
```

### Install Dependencies

```sh
npm install
```

### Run the Project

```sh
npm start
```

## Using Docker

### Docker Compose

You can run the project using Docker Compose. Ensure Docker and Docker Compose are installed on your machine.

```sh
docker-compose up --build
```

### Dockerfile

Alternatively, you can use Docker directly with the included Dockerfile.

```sh
docker build -t file-to-gpt .
docker run -p 3000:3000 file-to-gpt
```

## Available Scripts

- `npm start`: Starts the server.
- `npm run dev`: Starts a server with nodemon.
- `npm test`: Runs the tests.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
