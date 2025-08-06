import * as fs from 'fs';

//@ts-ignore
import { jsonToBruV2, jsonToCollectionBru, envJsonToBruV2 } from '@usebruno/lang';

import type { BrunoRequest, BrunoCollection, BrunoEnvironment, BrunoFolder } from './types';
import { validateRequest, validateCollection, validateEnvironment, validateFolder } from './validator/validateRequest';


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
 * Converts a Bruno folder object to folder .bru format string
 * Used for generating folder metadata files that control folder display name and sequence
 * 
 * Note: Internally uses the same Bruno language engine as generateCollection()
 * since folders and collections share the same underlying .bru format structure.
 * 
 * @param folder - The folder configuration object
 * @returns A .bru formatted string for the folder
 * 
 * @example
 * ```typescript
 * const folder: BrunoFolder = {
 *   meta: {
 *     name: "User Management",
 *     seq: 1
 *   }
 * };
 * 
 * const bruString = generateFolder(folder);
 * // Returns folder.bru content as string
 * ```
 */
export function generateFolder(folder: BrunoFolder): string {
  validateFolder(folder);
  
  // Use the same Bruno language engine as collections
  // Folders are simply collections with minimal metadata
  return jsonToCollectionBru(folder);
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

/**
 * Creates a filesystem folder and generates its folder.bru file
 * This is a utility function that combines filesystem operations with content generation
 * 
 * @param folderPath - The filesystem path where the folder should be created
 * @param folder - The folder configuration object
 * @returns The folder path that was created
 * 
 * @example
 * ```typescript
 * const folder: BrunoFolder = {
 *   meta: {
 *     name: "User Management",
 *     seq: 1
 *   }
 * };
 * 
 * const createdPath = createFolder("./my-collection/users", folder);
 * // Creates folder at ./my-collection/users/ and ./my-collection/users/folder.bru
 * ```
 */
export function createFolder(folderPath: string, folder: BrunoFolder): string {
  // Create the filesystem folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  // Generate the folder.bru content using the pure function
  const folderContent = generateFolder(folder);
  
  // Write the folder.bru file
  const folderBruPath = `${folderPath}/folder.bru`;
  fs.writeFileSync(folderBruPath, folderContent, 'utf8');
  
  return folderPath;
}

// Re-export all types for easy access
export * from './types';
