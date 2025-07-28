//@ts-ignore
import { jsonToBruV2, jsonToCollectionBru } from '@usebruno/lang';
import type { BrunoRequest, BrunoCollection } from './types';
import { validateRequest, validateCollection } from './validator/validateRequest';

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
 *     method: "GET",
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

// Re-export all types for easy access
export * from './types';
