import { BrunoRequest, BrunoCollection } from '../types';


export function validateRequest(request: BrunoRequest): void {
    // Validate HTTP method
    
    if (request.meta.type === 'graphql') {
        if(!request.body || !request.http.body) {
            throw new Error("GraphQL requests must have a body defined");
        }

        if (request.http.body !== 'graphql' || !request.body.graphql) {
            throw new Error("GraphQL requests must have a 'graphql' body type");
        }
        
        if (request.http.method !== 'post') {
            throw new Error("GraphQL requests must use POST method");
        }
    }

    if (request.meta.type === 'http') {
        if (request.http.body && request.http.body === 'graphql') {
            throw new Error("Body type can not be 'graphql' for HTTP requests");
        }
    }

    // If there's a body, check if it adheres to the specified type, if any.
    if (request.body) {
        if (typeof request.body === 'object' && 'json' in request.body && !request.body.json) {
            throw new Error("JSON body must be provided if 'json' is specified in body type");
        }
    }
    if (request.http.body && request.http.body === 'text' && !request.body?.text) {
        throw new Error("Text body must be provided for HTTP requests with 'text' body type");
    }
    if (request.http.body && request.http.body === 'xml' && !request.body?.xml) {
        throw new Error("XML body must be provided for HTTP requests with 'xml' body type");
    }
    if (request.http.body && request.http.body === 'sparql' && !request.body?.sparql) {
        throw new Error("SPARQL body must be provided for HTTP requests with 'sparql' body type");
    }
    if (request.http.body && request.http.body === 'formUrlEncoded' && !request.body?.formUrlEncoded) {
        throw new Error("Form URL Encoded body must be provided for HTTP requests with 'formUrlEncoded' body type");
    }
    if (request.http.body && request.http.body === 'multipartForm' && !request.body?.multipartForm) {
        throw new Error("Multipart Form body must be provided for HTTP requests with 'multipartForm' body type");
    }
    if (request.http.body && request.http.body === 'file' && !request.body?.file) {
        throw new Error("File body must be provided for HTTP requests with 'file' body type");
    }

}

export function validateCollection(collection: BrunoCollection): void {
    // Basic validation for collection
    if (!collection.meta || !collection.meta.name) {
        throw new Error("Collection must have a meta object with a name");
    }

    if (collection.meta.type !== 'collection') {
        throw new Error("Collection meta type must be 'collection'");
    }
}
