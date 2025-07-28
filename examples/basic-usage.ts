import { 
  generateRequest, 
  generateCollection, 
  BrunoRequest, 
  BrunoCollection,
  HttpMethod
} from '../src/index';

// Example 1: Simple GET request
const getRequest: BrunoRequest = {
  meta: {
    name: "Get User Profile",
    type: "http",
    seq: 1
  },
  http: {
    method: "GET" as HttpMethod,
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

// Example 2: POST request with JSON body
const postRequest: BrunoRequest = {
  meta: {
    name: "Create User",
    type: "http",
    seq: 2
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
  },
  tests: `
    expect(res.status).to.equal(201);
    expect(res.body.id).to.be.a('string');
  `
};

// Example 3: Request with form data
const formRequest: BrunoRequest = {
  meta: {
    name: "Upload File",
    type: "http"
  },
  http: {
    method: "POST",
    url: "https://api.example.com/upload"
  },
  body: {
    multipartForm: [
      { name: "file", value: "/path/to/file.jpg", type: "file", enabled: true },
      { name: "description", value: "Profile photo", type: "text", enabled: true }
    ]
  }
};

// Example 4: Request with OAuth2 authentication
const oauthRequest: BrunoRequest = {
  meta: {
    name: "Protected Resource",
    type: "http"
  },
  http: {
    method: "GET",
    url: "https://api.example.com/protected"
  },
  auth: {
    oauth2: {
      grantType: "authorization_code",
      authorizationUrl: "https://auth.example.com/oauth/authorize",
      accessTokenUrl: "https://auth.example.com/oauth/token",
      clientId: "{{client_id}}",
      clientSecret: "{{client_secret}}",
      scope: "read write",
      tokenPlacement: "header",
      tokenHeaderPrefix: "Bearer",
      autoFetchToken: true
    }
  }
};

// Example 5: Collection configuration
const apiCollection: BrunoCollection = {
  meta: {
    name: "User Management API",
    type: "collection"
  },
  headers: [
    { name: "User-Agent", value: "BrunoGenerator/1.0", enabled: true },
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
  },
  script: {
    req: `
      // Set common headers
      bru.setVar("timestamp", Date.now());
    `,
    res: `
      // Log response time
      console.log("Response time:", bru.getResponseTime());
    `
  }
};

// Generate the .bru files
console.log("=== GET Request ===");
console.log(generateRequest(getRequest));

console.log("\n=== POST Request ===");
console.log(generateRequest(postRequest));

console.log("\n=== Form Request ===");
console.log(generateRequest(formRequest));

console.log("\n=== OAuth Request ===");
console.log(generateRequest(oauthRequest));

console.log("\n=== Collection Configuration ===");
console.log(generateCollection(apiCollection));
