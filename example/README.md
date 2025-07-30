# Bruno Generator Examples

This directory contains comprehensive examples and tests for the `@wilde-it/bruno-generator` package.

## What's Included

### `example.ts`
A complete example file that demonstrates:

1. **GET Request Generation** - Shows how to create a GET request with:
   - Bearer token authentication
   - Query parameters
   - Custom headers
   - Test assertions

2. **POST Request Generation** - Demonstrates creating a POST request with:
   - JSON body payload
   - Pre-request scripts for dynamic variables
   - Content-Type headers
   - Response validation tests

3. **Collection Configuration (.bru)** - Illustrates collection configuration with:
   - Collection-level authentication
   - Shared headers and variables
   - Pre/post request scripts
   - Collection-wide test assertions

4. **Collection Metadata (bruno.json)** - Shows how to create collection metadata with:
   - Collection version information
   - Collection name and type
   - Proper JSON structure for Bruno

### Built-in Tests
The example includes 3 automated tests that verify:
- ✅ GET request generation produces valid `.bru` format
- ✅ POST request generation includes all required blocks
- ✅ Collection generation contains proper structure

## Running the Examples

### Prerequisites
Make sure you have built the package first:

```bash
# From the project root
bun run build
```

### Execute Examples
```bash
# From the project root
bun run example/example.ts

# Or from the example directory
cd example
bun run example.ts
```

### Expected Output
When you run the examples, you'll see:

1. **Console Output**: Detailed logs showing the generated `.bru` content for each example
2. **Generated Files**: Three files will be created in `example/generated/`:
   - `get-user.bru` - Individual GET request file
   - `create-user.bru` - Individual POST request file  
   - `bruno.json` - Collection configuration file
3. **Test Results**: Validation that all generated content is properly formatted

## Generated Files

### `get-user.bru`
```
meta {
  name: Get User Profile
  type: http
  seq: 1
}

get {
  url: https://api.example.com/users/{{userId}}?include=profile,settings&format=json
}

headers {
  Authorization: Bearer {{token}}
  Accept: application/json
  User-Agent: BrunoGenerator/1.0
}

tests {
  expect(res.status).to.equal(200);
  expect(res.body).to.have.property('user');
  expect(res.body.user).to.have.property('id');
  expect(res.body.user).to.have.property('email');
}
```

### `create-user.bru`
```
meta {
  name: Create New User
  type: http
  seq: 2
}

post {
  url: https://api.example.com/users
}

headers {
  Content-Type: application/json
  Authorization: Bearer {{admin_token}}
  Accept: application/json
}

body {
  json: {
    "name": "{{userName}}",
    "email": "{{userEmail}}",
    "role": "user",
    "settings": {
      "notifications": true,
      "theme": "light"
    }
  }
}

script {
  req: // Set dynamic variables before request
       bru.setVar('userName', 'John Doe');
       bru.setVar('userEmail', `john.doe.${Date.now()}@example.com`);
       console.log('Creating user:', bru.getVar('userName'));
}

tests {
  expected(res.status).to.equal(201);
  expect(res.body).to.have.property('id');
  expect(res.body.name).to.equal(bru.getVar('userName'));
  expect(res.body.email).to.equal(bru.getVar('userEmail'));
}
```

### `bruno.json` (Collection)
Collection configuration with shared authentication, headers, variables, and scripts that apply to all requests in the collection.

## Using Generated Files in Bruno

1. **Import into Bruno**: Copy the generated `.bru` files into your Bruno collection directory
2. **Set Variables**: Define the required variables (`{{userId}}`, `{{token}}`, etc.) in your Bruno environment
3. **Run Requests**: Use Bruno's interface to execute the requests
4. **View Tests**: Test results will be displayed in Bruno's test runner

## Key Features Demonstrated

### Authentication
- Bearer token authentication
- Collection-level vs request-level auth

### Dynamic Variables  
- Pre-request scripts to set variables
- Template variables in URLs and headers
- Environment-specific configurations

### Request Types
- GET requests with query parameters
- POST requests with JSON bodies
- Different header configurations

### Testing & Validation
- Response status assertions
- Body structure validation  
- Custom test scripts
- Collection-level tests

### Scripts
- Pre-request variable setup
- Post-response logging
- Error handling
- Dynamic data generation

## Customization

Feel free to modify the examples to match your API requirements:

1. **Change URLs**: Update the `url` fields to point to your API endpoints
2. **Modify Headers**: Add/remove headers as needed for your API
3. **Update Body Structure**: Change the JSON payload structure
4. **Customize Tests**: Write assertions specific to your API responses
5. **Add Authentication**: Configure auth methods appropriate for your API

## Next Steps

After running these examples:

1. Use the generated files as templates for your own API requests
2. Create additional request types (PUT, DELETE, PATCH)
3. Explore advanced features like file uploads, GraphQL, or different auth methods
4. Set up collection-level configurations for your entire API suite

For more advanced usage, check the main package documentation and TypeScript type definitions in `src/types.ts`.
