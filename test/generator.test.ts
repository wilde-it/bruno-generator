import { expect, test, describe } from "bun:test";
import { 
  generateRequest, 
  generateCollection, 
} from "../src/index";
import type { BrunoCollection, BrunoRequest, HttpMethod } from "../src/types";

describe("Bruno Generator", () => {
  describe("generateRequest", () => {
    test("should generate a simple GET request", () => {
      const request: BrunoRequest = {
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
        ]
      };

      const result = generateRequest(request);
      
      expect(result).toContain("meta {");
      expect(result).toContain("name: Get User Profile");
      expect(result).toContain("type: http");
      expect(result).toContain("seq: 1");
      expect(result).toContain("GET {");
      expect(result).toContain("url: https://api.example.com/users/{{userId}}");
      expect(result).toContain("headers {");
      expect(result).toContain("Authorization: Bearer {{token}}");
      expect(result).toContain("Accept: application/json");
      expect(result).toContain("params:query {");
      expect(result).toContain("include: profile,settings");
    });

    test("should pass with valid data", () => {
      const validRequest: BrunoRequest = {
        meta: {
          name: "Create User",
          type: "http",
          seq: 1
        },
        http: {
          method: "GET" as HttpMethod,
          url: "https://api.example.com/users/123"
        },
        headers: [
          { name: "Authorization", value: "Bearer valid-token", enabled: true }
        ],
        params: [
          { name: "userId", value: "123", type: "path", enabled: true }
        ]
      };

      expect(() => generateRequest(validRequest)).not.toThrow();
    });

    test("should generate a POST request with JSON body", () => {
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
        }
      };

      const result = generateRequest(postRequest);
      
      expect(result).toContain("meta {");
      expect(result).toContain("name: Create User");
      expect(result).toContain("POST {");
      expect(result).toContain("url: https://api.example.com/users");
      expect(result).toContain("headers {");
      expect(result).toContain("Content-Type: application/json");
      expect(result).toContain("body:json {");
      expect(result).toContain('"name": "John Doe"');
      expect(result).toContain('"email": "john@example.com"');
    });

    describe("Validation Tests", () => {
      test("should validate GraphQL requests correctly", () => {
        const validGraphQLRequest: BrunoRequest = {
          meta: {
            name: "GraphQL Query",
            type: "graphql",
            seq: 1
          },
          http: {
            method: "POST",
            url: "https://api.example.com/graphql",
            body: "graphql"
          },
          body: {
            graphql: {
              query: "{ user { id name } }"
            }
          }
        };

        expect(() => generateRequest(validGraphQLRequest)).not.toThrow();
      });

      test("should reject GraphQL requests without body", () => {
        const invalidGraphQLRequest: BrunoRequest = {
          meta: {
            name: "GraphQL Query",
            type: "graphql",
            seq: 1
          },
          http: {
            method: "POST",
            url: "https://api.example.com/graphql"
          }
        };

        expect(() => generateRequest(invalidGraphQLRequest)).toThrow("GraphQL requests must have a body defined");
      });

      test("should reject GraphQL requests with non-POST method", () => {
        const invalidGraphQLRequest: BrunoRequest = {
          meta: {
            name: "GraphQL Query",
            type: "graphql",
            seq: 1
          },
          http: {
            method: "GET",
            url: "https://api.example.com/graphql",
            body: "graphql"
          },
          body: {
            graphql: {
              query: "{ user { id name } }"
            }
          }
        };

        expect(() => generateRequest(invalidGraphQLRequest)).toThrow("GraphQL requests must use POST method");
      });

      test("should reject HTTP requests with GraphQL body type", () => {
        const invalidHTTPRequest: BrunoRequest = {
          meta: {
            name: "Create User",
            type: "http",
            seq: 1
          },
          http: {
            method: "POST",
            url: "https://api.example.com/users",
            body: "graphql"
          },
          body: {
            graphql: {
              query: "{ user { id name } }"
            }
          }
        };

        expect(() => generateRequest(invalidHTTPRequest)).toThrow("Body type can not be 'graphql' for HTTP requests");
      });

      test("should reject empty JSON body when specified", () => {
        const invalidRequest: BrunoRequest = {
          meta: {
            name: "Create User",
            type: "http",
            seq: 1
          },
          http: {
            method: "POST",
            url: "https://api.example.com/users"
          },
          body: {
            json: ""
          }
        };

        expect(() => generateRequest(invalidRequest)).toThrow("JSON body must be provided if 'json' is specified in body type");
      });

      test("should validate different body types correctly", () => {
        // Test text body validation
        const textRequest: BrunoRequest = {
          meta: { name: "Test", type: "http", seq: 1 },
          http: { method: "POST", url: "https://api.example.com", body: "text" },
          body: { text: "Hello World" }
        };
        expect(() => generateRequest(textRequest)).not.toThrow();

        // Test XML body validation
        const xmlRequest: BrunoRequest = {
          meta: { name: "Test", type: "http", seq: 1 },
          http: { method: "POST", url: "https://api.example.com", body: "xml" },
          body: { xml: "<user><name>John</name></user>" }
        };
        expect(() => generateRequest(xmlRequest)).not.toThrow();

        // Test form body validation
        const formRequest: BrunoRequest = {
          meta: { name: "Test", type: "http", seq: 1 },
          http: { method: "POST", url: "https://api.example.com", body: "formUrlEncoded" },
          body: { formUrlEncoded: [{ name: "username", value: "johndoe", enabled: true }] }
        };
        expect(() => generateRequest(formRequest)).not.toThrow();

        // Test invalid body type error messages
        const invalidRequests = [
          {
            name: "text",
            request: {
              meta: { name: "Test", type: "http", seq: 1 },
              http: { method: "POST", url: "https://api.example.com", body: "text" },
              body: {}
            },
            expectedError: "Text body must be provided for HTTP requests with 'text' body type"
          },
          {
            name: "xml",
            request: {
              meta: { name: "Test", type: "http", seq: 1 },
              http: { method: "POST", url: "https://api.example.com", body: "xml" },
              body: {}
            },
            expectedError: "XML body must be provided for HTTP requests with 'xml' body type"
          },
          {
            name: "sparql",
            request: {
              meta: { name: "Test", type: "http", seq: 1 },
              http: { method: "POST", url: "https://api.example.com", body: "sparql" },
              body: {}
            },
            expectedError: "SPARQL body must be provided for HTTP requests with 'sparql' body type"
          }
        ];

        invalidRequests.forEach(({ name, request, expectedError }) => {
          expect(() => generateRequest(request as BrunoRequest)).toThrow(expectedError);
        });
      });

      test("should validate collection edge cases", () => {
        const validCollection: BrunoCollection = {
          meta: {
            name: "API Collection",
            type: "collection",
            seq: 1
          }
        };

        expect(() => generateCollection(validCollection)).not.toThrow();
      });

      test("should reject collections without meta", () => {
        const invalidCollection = {} as BrunoCollection;

        expect(() => generateCollection(invalidCollection)).toThrow("Collection must have a meta object with a name");
      });

      test("should reject collections without name in meta", () => {
        const invalidCollection: BrunoCollection = {
          meta: {
            type: "collection",
            seq: 1
          } as any
        };

        expect(() => generateCollection(invalidCollection)).toThrow("Collection must have a meta object with a name");
      });

      test("should reject collections with wrong meta type", () => {
        const invalidCollection: BrunoCollection = {
          meta: {
            name: "API Collection",
            type: "http",
            seq: 1
          } as any
        };

        expect(() => generateCollection(invalidCollection)).toThrow("Collection meta type must be 'collection'");
      });

      test("should handle collections with optional fields", () => {
        const collectionWithOptionalFields: BrunoCollection = {
          meta: {
            name: "Full Collection",
            type: "collection",
            seq: 1
          },
          headers: [
            { name: "User-Agent", value: "MyApp/1.0", enabled: true }
          ],
          auth: {
            mode: "bearer",
            bearer: {
              token: "{{token}}"
            }
          },
          query: [
            { name: "version", value: "v1", enabled: true }
          ]
        };

        expect(() => generateCollection(collectionWithOptionalFields)).not.toThrow();
        const result = generateCollection(collectionWithOptionalFields);
        expect(result).toContain("name: Full Collection");
      });

      test("should handle collections with empty arrays", () => {
        const collectionWithEmptyArrays: BrunoCollection = {
          meta: {
            name: "Empty Arrays Collection",
            type: "collection",
            seq: 1
          },
          headers: [],
          query: []
        };

        expect(() => generateCollection(collectionWithEmptyArrays)).not.toThrow();
        const result = generateCollection(collectionWithEmptyArrays);
        expect(result).toContain("name: Empty Arrays Collection");
      });

      test("should validate complex multipart and file requests", () => {
        // Test multipart form request
        const multipartRequest: BrunoRequest = {
          meta: { name: "Upload File", type: "http", seq: 1 },
          http: { method: "POST", url: "https://api.example.com/upload", body: "multipartForm" },
          body: {
            multipartForm: [
              { name: "file", value: "image.jpg", type: "file", enabled: true },
              { name: "description", value: "Profile picture", type: "text", enabled: true }
            ]
          }
        };
        expect(() => generateRequest(multipartRequest)).not.toThrow();

        // Test file upload request
        const fileRequest: BrunoRequest = {
          meta: { name: "Direct File Upload", type: "http", seq: 1 },
          http: { method: "POST", url: "https://api.example.com/files", body: "file" },
          body: {
            file: [{
              selected: true,
              filePath: "/path/to/file.txt",
              enabled: true
            }]
          }
        };
        expect(() => generateRequest(fileRequest)).not.toThrow();

        // Test SPARQL body
        const sparqlRequest: BrunoRequest = {
          meta: { name: "SPARQL Query", type: "http", seq: 1 },
          http: { method: "POST", url: "https://api.example.com/sparql", body: "sparql" },
          body: { sparql: "SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10" }
        };
        expect(() => generateRequest(sparqlRequest)).not.toThrow();
      });

      test("should validate edge cases for requests", () => {
        // Test request with no body - should pass
        const requestWithoutBody: BrunoRequest = {
          meta: { name: "Get User", type: "http", seq: 1 },
          http: { method: "GET", url: "https://api.example.com/users/123" }
        };
        expect(() => generateRequest(requestWithoutBody)).not.toThrow();

        // Test request with empty body object - should pass
        const requestWithEmptyBody: BrunoRequest = {
          meta: { name: "Get User", type: "http", seq: 1 },
          http: { method: "GET", url: "https://api.example.com/users/123" },
          body: {}
        };
        expect(() => generateRequest(requestWithEmptyBody)).not.toThrow();
      });
    });

  });

  describe("generateCollection", () => {

    test("should generate a basic collection", () => {
      const apiCollection: BrunoCollection = {
        meta: {
          name: "User Management API",
          seq: 1,
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
        }
      };

      const result = generateCollection(apiCollection);
      
      expect(result).toContain("meta {");
      expect(result).toContain("name: User Management API");
      expect(result).toContain("type: collection");
      expect(result).toContain("headers {");
      expect(result).toContain("User-Agent: BrunoGenerator/1.0");
      expect(result).toContain("Accept: application/json");
      expect(result).toContain("auth {");
      expect(result).toContain("mode: bearer");
      expect(result).toContain("auth:bearer {");
      expect(result).toContain("token: {{api_token}}");
    });
  });

  describe("Integration tests", () => {
    test("should handle empty/minimal requests gracefully", () => {
      const minimalRequest: BrunoRequest = {
        meta: {
          name: "Create User",
          type: "http",
          seq: 1
        },
        http: {
          method: "GET",
          url: "https://api.example.com"
        }
      };

      const result = generateRequest(minimalRequest);
      
      expect(result).toContain("GET {");
      expect(result).toContain("url: https://api.example.com");
      expect(result.length).toBeGreaterThan(10);
    });

    test("should handle empty collection gracefully", () => {
      const minimalCollection: BrunoCollection = {
        meta: {
          name: "Empty Collection",
          seq: 1,
          type: "collection"
        }
      };

      const result = generateCollection(minimalCollection);
      
      expect(result).toContain("meta {");
      expect(result).toContain("name: Empty Collection");
      expect(result).toContain("type: collection");
    });
  });
});
