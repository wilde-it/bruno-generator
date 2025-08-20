import { generateRequest, generateCollection, generateCollectionJson, generateEnvironment, createFolder, BrunoRequest, BrunoCollection, BrunoEnvironment, BrunoFolder } from "../src";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Example 1: Generate a simple GET request with authentication
 */
function exampleGetRequest() {
  console.log('\n=== Example 1: GET Request with Bearer Auth ===');

  const getUserRequest: BrunoRequest = {
    meta: {
      name: "Get User Profile",
      type: "http",
      seq: 1
    },
    http: {
      method: "get",
      url: "https://api.example.com/users/{{userId}}"
    },
    headers: [
      { name: "Authorization", value: "Bearer {{token}}", enabled: true },
      { name: "Accept", value: "application/json", enabled: true },
      { name: "User-Agent", value: "BrunoGenerator/1.0", enabled: true }
    ],
    params: [
      { name: "include", value: "profile,settings", type: "query", enabled: true },
      { name: "format", value: "json", type: "query", enabled: true }
    ],
    tests: `
expect(res.status).to.equal(200);
expect(res.body).to.have.property('user');
expect(res.body.user).to.have.property('id');
expect(res.body.user).to.have.property('email');
    `.trim()
  };

  const bruContent = generateRequest(getUserRequest);
  console.log('Generated .bru content:');

  // Save to file for testing (in nested profiles folder)
  const outputPath = path.join(__dirname, 'generated', 'users', 'profiles', 'get-user.bru');
  saveToFile(outputPath, bruContent);

}

/**
 * Example 2: Generate a POST request with JSON body
 */
function examplePostRequest() {
  console.log('\n=== Example 2: POST Request with JSON Body ===');

  const createUserRequest: BrunoRequest = {
    meta: {
      name: "Create New User",
      type: "http",
      seq: 2
    },
    http: {
      method: "post",
      url: "https://api.example.com/users"
    },
    headers: [
      { name: "Content-Type", value: "application/json", enabled: true },
      { name: "Authorization", value: "Bearer {{admin_token}}", enabled: true },
      { name: "Accept", value: "application/json", enabled: true }
    ],
    body: {
      json: JSON.stringify({
        name: "{{userName}}",
        email: "{{userEmail}}",
        role: "user",
        settings: {
          notifications: true,
          theme: "light"
        }
      }, null, 2)
    },
    tests: `
expect(res.status).to.equal(201);
expect(res.body).to.have.property('id');
expect(res.body.name).to.equal(bru.getVar('userName'));
expect(res.body.email).to.equal(bru.getVar('userEmail'));
    `.trim(),
    script: {
      req: `
// Set dynamic variables before request
bru.setVar('userName', 'John Doe');
bru.setVar('userEmail', 'john.doe.' + Date.now() + '@example.com');
console.log('Creating user:', bru.getVar('userName'));
      `.trim()
    }
  };

  const bruContent = generateRequest(createUserRequest);
  console.log('Generated .bru content:');

  // Save to file for testing (in users folder)
  const outputPath = path.join(__dirname, 'generated', 'users', 'create-user.bru');
  saveToFile(outputPath, bruContent);

}

/**
 * Example 3: Generate a collection configuration (.bru file)
 */
function exampleCollection() {
  console.log('\n=== Example 3: Collection Configuration (.bru) ===');

  const apiCollection: BrunoCollection = {
    meta: {
      name: "User Management API",
      type: "collection",
      seq: 1
    },
    headers: [
      { name: "User-Agent", value: "UserManagementApp/2.0", enabled: true },
      { name: "Accept", value: "application/json", enabled: true },
      { name: "X-API-Version", value: "{{apiVersion}}", enabled: true }
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
        { name: "apiVersion", value: "v2", enabled: true, local: false },
        { name: "timeout", value: "30000", enabled: true, local: false }
      ]
    },
    script: {
      req: `
// Collection-level pre-request script
console.log('API Base URL:', bru.getVar('baseUrl'));
console.log('API Version:', bru.getVar('apiVersion'));

// Add timestamp to requests
bru.setVar('requestTimestamp', new Date().toISOString());
      `.trim(),
      res: `
// Collection-level post-response script
console.log('Response received at:', new Date().toISOString());
console.log('Response status:', res.status);

// Log any errors
if (res.status >= 400) {
  console.error('API Error:', res.status, res.body);
}
      `.trim()
    },
    tests: `
// Collection-level tests that run for all requests
expect(res.responseTime).to.be.below(5000);
expect(res.headers).to.have.property('content-type');
    `.trim()
  };

  const bruContent = generateCollection(apiCollection);
  console.log('Generated collection .bru content:');

  // Save collection configuration to .bru file
  const collectionBruPath = path.join(__dirname, 'generated', 'collection.bru');
  saveToFile(collectionBruPath, bruContent);
}

/**
 * Example 4: Generate environment configuration on collection level.
 */
function exampleEnvironment() {
  console.log('\n=== Example 4: Environment Configuration ===');

  const apiEnvironment: BrunoEnvironment = {
    variables: [
      { name: "userId", value: "testUser", enabled: true },
      { name: "legacyUrl", value: "https://old.api.example.com", enabled: false },
      { name: "token", enabled: true, secret: true },
    ]
  };

  const bruContent = generateEnvironment(apiEnvironment);
  console.log('Generated environment .bru content:');
  console.log(bruContent);

  // Save environment configuration to .bru file (Bruno expects environments in 'environments/' folder)
  const environmentBruPath = path.join(__dirname, 'generated', 'environments', 'development.bru');
  saveToFile(environmentBruPath, bruContent);
}

/**
 * Example 5: Generate folder configuration (folder.bru file)
 * Demonstrates nested folder creation
 */
function exampleFolder() {
  console.log('\n=== Example 5: Folder Configuration (folder.bru) ===');

  // Create the main users folder
  const userFolder: BrunoFolder = {
    meta: {
      name: "User Management",
      seq: 1
    }
  };

  const userFolderPath = path.join(__dirname, 'generated', 'users');
  const createdUserPath = createFolder(userFolderPath, userFolder);
  
  console.log('Created User Management folder at:', createdUserPath);

  // Create nested profiles folder within users
  const profilesFolder: BrunoFolder = {
    meta: {
      name: "User Profiles",
      seq: 1
    }
  };

  const profilesFolderPath = path.join(__dirname, 'generated', 'users', 'profiles');
  const createdProfilesPath = createFolder(profilesFolderPath, profilesFolder);
  
  console.log('Created nested User Profiles folder at:', createdProfilesPath);
  console.log('This nested structure will contain: users/ (create-user.bru) and users/profiles/ (get-user.bru)');
}

/**
 * Example 6: Generate bruno.json metadata file
 */
function exampleCollectionJson() {
  console.log('\n=== Example 6: Collection Metadata (bruno.json) ===');

  const collectionName = "User Management API";
  const version = "1";

  const jsonContent = generateCollectionJson(collectionName, version);
  console.log('Generated bruno.json content:');
  console.log(jsonContent);

  // Save to bruno.json file
  const outputPath = path.join(__dirname, 'generated', 'bruno.json');
  saveToFile(outputPath, jsonContent);
}

/**
 * Test function to validate generated content
 */
function runExamples() {
  console.log('\n=== Running Examples ===');

  // Test 1: Verify collection generation
  console.log('Test 1: Collection configuration generation...');
  exampleCollection();

  // Test 2: Verify environment generation
  console.log('Test 2: Environment configuration generation...');
  exampleEnvironment();

  // Test 3: Verify folder generation (create folder structure first)
  console.log('Test 3: Folder configuration generation...');
  exampleFolder();

  // Test 4: Verify GET request generation (now goes into existing folder)
  console.log('Test 4: GET request generation...');
  exampleGetRequest();

  // Test 5: Verify POST request generation (now goes into existing folder)
  console.log('Test 5: POST request generation...');
  examplePostRequest();

  // Test 6: Verify bruno.json generation
  console.log('Test 6: Bruno.json metadata generation...');
  exampleCollectionJson();

}

/**
 * Helper function to save content to file
 */
function saveToFile(filePath: string, content: string) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`💾 Saved to: ${filePath}`);
  } catch (error) {
    console.error(`Failed to save file ${filePath}:`, error.message);
  }
}

console.log('🚀 Bruno Generator Examples & Tests');
console.log('===================================');

// Create output directory
const outputDir = path.join(__dirname, 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Run examples and tests
runExamples();

console.log('\nGenerated files can be found in:', outputDir);
console.log('\nYou can now import these .bru files into Bruno for testing!');

