# File to GPT

This is an API that uses LangChain, Bedrock, and Postgres pgvector to provide Retrieval Augmented Generation (RAG) functionality. This project has two main endpoints: one for uploading files to the RAG system and another for interacting with the Claude3 model through AWS Bedrock.

## Prerequisites

- Node.js (version 20 or higher)
- npm (version 10 or higher)
- Docker (optional)

## Setup

### Clone the Repository

```sh
git clone https://github.com/your-username/express-bedrock-rag.git
cd express-bedrock-rag
```

### Set Up Environment Variables

Copy the example file and make sure to modify the .env file with your specific configurations afterward.

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
docker build -t express-bedrock-rag .
docker run -p 3000:3000 express-bedrock-rag
```

## Available Scripts

- `npm start`: Starts the server.
- `npm run dev`: Starts a server with nodemon.
- `npm test`: Runs the tests.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
