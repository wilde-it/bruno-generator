import fs from 'fs';

//@ts-ignore
import { jsonToBruV2, jsonToCollectionBru, envJsonToBruV2 } from '@usebruno/lang';

import type { BrunoRequest, BrunoCollection, BrunoEnvironment } from './types';
import { validateRequest, validateCollection, validateEnvironment } from './validator/validateRequest';


/**
 * Converts a Bruno request object to .bru format string
 * Used for generating individual HTTP request files
 * 
 * @param request - The request configuration object
 * @returns A .bru formatted string for the request
 * 
 * @example
 * ```typescript
 * const request: BrunoRequest = {
 *   meta: {
 *     name: "Get User",
 *     type: "http"
 *   },
 *   http: {
 *     method: "get",
 *     url: "https://api.example.com/users/{{userId}}"
 *   },
 *   headers: [
 *     { name: "Authorization", value: "Bearer {{token}}", enabled: true }
 *   ]
 * };
 * 
 * const bruString = generateRequest(request);
 * ```
 */
export function generateRequest(request: BrunoRequest): string {
  validateRequest(request);
  return jsonToBruV2(request);
}

/**
 * Converts a Bruno collection object to collection .bru format string
 * Used for generating collection-level configuration files
 * 
 * @param collection - The collection configuration object
 * @returns A .bru formatted string for the collection
 * 
 * @example
 * ```typescript
 * const collection: BrunoCollection = {
 *   meta: {
 *     name: "My API Collection",
 *     type: "collection"
 *   },
 *   headers: [
 *     { name: "User-Agent", value: "MyApp/1.0", enabled: true }
 *   ],
 *   auth: {
 *     mode: "bearer",
 *     bearer: {
 *       token: "{{api_token}}"
 *     }
 *   }
 * };
 * 
 * const bruString = generateCollection(collection);
 * ```
 */
export function generateCollection(collection: BrunoCollection): string {
  validateCollection(collection);
  return jsonToCollectionBru(collection);
}

/**
 * Converts a Bruno environment object to environment .bru format string
 * Used for generating environment variable files
 * 
 * @param environment - The environment configuration object
 * @returns A .bru formatted string for the environment
 * 
 * @example
 * ```typescript
 * const environment: BrunoEnvironment = {
 *   variables: [
 *     { name: "baseUrl", value: "https://api.example.com", enabled: true },
 *     { name: "apiKey", value: "secret-key-123", enabled: true, secret: true },
 *     { name: "timeout", value: "30000", enabled: false }
 *   ]
 * };
 * 
 * const bruString = generateEnvironment(environment);
 * ```
 */
export function generateEnvironment(environment: BrunoEnvironment): string {
  validateEnvironment(environment);
  return envJsonToBruV2(environment);
}

/**
 * Generates a bruno.json file content for collection metadata
 * This creates the collection's metadata file, not the collection configuration
 * 
 * @param collectionName - The name of the collection
 * @param version - The version of the collection (default: "1")
 * @returns A JSON string for the bruno.json file
 * 
 * @example
 * ```typescript
 * const collectionJson = generateCollectionJson("My API Collection", "1");
 * // Creates: { "version": "1", "name": "My API Collection", "type": "collection" }
 * ```
 */
export function generateCollectionJson(collectionName: string, version: string = "1"): string {
  const collectionMetadata = {
    version: version,
    name: collectionName,
    type: "collection"
  };
  
  return JSON.stringify(collectionMetadata, null, 2);
}

// Re-export all types for easy access
export * from './types';
