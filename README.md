# Bruno Generator

A TypeScript library for generating Bruno request and collection files programmatically. This library provides strongly-typed interfaces for creating `.bru` files used by the [Bruno API client](https://www.usebruno.com/).

## Features

- 🎯 **Fully Typed**: Complete TypeScript interfaces for all Bruno features
- 🔧 **Two Main Functions**: Generate individual requests and collection configurations  
- 📝 **Rich Documentation**: Comprehensive examples and API documentation
- 🚀 **Easy to Use**: Simple, intuitive API built on top of `@usebruno/lang`
- ✅ **Full Feature Support**: All Bruno features including auth, variables, scripts, and more
- ⚡ **Built with Bun**: Fast development and build experience

## Installation

```bash
bun add bruno-generator
# or
npm install bruno-generator
# or
yarn add bruno-generator
```

## Quick Start

```typescript
import { generateRequest, generateCollection, BrunoRequest, BrunoCollection } from 'bruno-generator';

// Create a simple GET request
const request: BrunoRequest = {
  meta: {
    name: "Get User",
    type: "http"
  },
  http: {
    method: "GET",
    url: "https://api.example.com/users/{{userId}}"
  },
  headers: [
    { name: "Authorization", value: "Bearer {{token}}", enabled: true }
  ]
};

// Generate the .bru file content
const bruContent = generateRequest(request);
console.log(bruContent);
```

## API Reference

### Functions

#### `generateRequest(request: BrunoRequest): string`

Converts a Bruno request object to `.bru` format string for individual HTTP requests.

#### `generateCollection(collection: BrunoCollection): string`

Converts a Bruno collection object to collection `.bru` format string for collection-level configurations.

### Key Differences

- **`generateRequest`**: Creates individual HTTP request files (.bru) with full request details including HTTP method, body, parameters, etc.
- **`generateCollection`**: Creates collection-level configuration files for shared settings like authentication, headers, and variables that apply to all requests in a collection.

## Examples

### Basic GET Request

```typescript
import { generateRequest, BrunoRequest } from 'bruno-generator';

const getRequest: BrunoRequest = {
  meta: {
    name: "Get User Profile",
    type: "http",
    seq: 1
  },
  http: {
    method: "GET",
    url: "https://api.example.com/users/{{userId}}"
  },
  headers: [
    { name: "Authorization", value: "Bearer {{token}}", enabled: true },
    { name: "Accept", value: "application/json", enabled: true }
  ],
  params: [
    { name: "include", value: "profile,settings", type: "query", enabled: true }
  ],
  tests: `
    expect(res.status).to.equal(200);
    expect(res.body.user).to.be.an('object');
  `
};

const bruContent = generateRequest(getRequest);
```

### POST Request with JSON Body

```typescript
const postRequest: BrunoRequest = {
  meta: {
    name: "Create User",
    type: "http"
  },
  http: {
    method: "POST",
    url: "https://api.example.com/users"
  },
  headers: [
    { name: "Content-Type", value: "application/json", enabled: true },
    { name: "Authorization", value: "Bearer {{token}}", enabled: true }
  ],
  body: {
    json: JSON.stringify({
      name: "John Doe",
      email: "john@example.com",
      role: "user"
    }, null, 2)
  }
};
```

### Collection Configuration

```typescript
import { generateCollection, BrunoCollection } from 'bruno-generator';

const apiCollection: BrunoCollection = {
  meta: {
    name: "User Management API",
    type: "collection"
  },
  headers: [
    { name: "User-Agent", value: "MyApp/1.0", enabled: true },
    { name: "Accept", value: "application/json", enabled: true }
  ],
  auth: {
    mode: "bearer",
    bearer: {
      token: "{{api_token}}"
    }
  },
  vars: {
    req: [
      { name: "baseUrl", value: "https://api.example.com", enabled: true, local: false },
      { name: "apiVersion", value: "v1", enabled: true, local: false }
    ]
  }
};

const collectionContent = generateCollection(apiCollection);
```

## Supported Features

### Authentication Methods
- Basic Auth, Bearer Token, API Key
- AWS Signature V4, OAuth2 (all grant types)
- Digest Auth, NTLM, WSSE

### Body Types
- JSON, XML, Text, SPARQL
- Form URL Encoded, Multipart Form
- File uploads, GraphQL

### Other Features
- Variables (pre-request, post-response)
- Scripts (JavaScript)
- Tests and Assertions
- Headers and Parameters
- Collection-level settings

## Development

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Run examples
bun run example

# Watch mode for development
bun run dev

# Type checking
bun run lint

# Run tests
bun test
```

## Project Structure

```
bruno-generator/
├── src/
│   ├── index.ts          # Main library exports
│   └── types.ts          # TypeScript type definitions
├── examples/
│   └── basic-usage.ts    # Usage examples
├── dist/                 # Built output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Related

- [Bruno](https://www.usebruno.com/) - The API client this library generates files for
- [@usebruno/lang](https://www.npmjs.com/package/@usebruno/lang) - The underlying parser library
- [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
