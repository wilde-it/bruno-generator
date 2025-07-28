// Base types
export interface EnabledItem {
  enabled: boolean;
}

export interface NameValuePair extends EnabledItem {
  name: string;
  value: string;
}

export interface LocalVariable extends EnabledItem {
  name: string;
  value: string;
  local: boolean;
}

// Meta information
export interface BrunoMeta {
  name: string;
  type: "http" | "graphql" | "collection";
  seq: number;
  tags?: string[];
  [key: string]: any;
}

// HTTP Method and Request
export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  body?: BodyType ;
  auth?: AuthType;
}

// Parameters
export interface Parameter extends NameValuePair {
  type: 'query' | 'path';
}

// Headers
export interface Header extends NameValuePair {}

// Authentication types
export interface AwsV4Auth {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  service: string;
  region: string;
  profileName?: string;
}

export interface BasicAuth {
  username: string;
  password: string;
}

export interface WsseAuth {
  username: string;
  password: string;
}

export interface BearerAuth {
  token: string;
}

export interface DigestAuth {
  username: string;
  password: string;
}

export interface NtlmAuth {
  username: string;
  password: string;
  domain: string;
}

export interface ApiKeyAuth {
  key: string;
  value: string;
  placement: 'header' | 'query';
}

export interface OAuth2Auth {
  grantType: 'password' | 'authorization_code' | 'client_credentials' | 'implicit';
  accessTokenUrl?: string;
  refreshTokenUrl?: string;
  authorizationUrl?: string;
  callbackUrl?: string;
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  state?: string;
  pkce?: boolean;
  credentialsPlacement?: string;
  credentialsId?: string;
  tokenPlacement?: 'header' | 'query';
  tokenHeaderPrefix?: string;
  tokenQueryKey?: string;
  autoFetchToken?: boolean;
  autoRefreshToken?: boolean;
}

// Request Authentication (for individual requests)
export interface RequestAuth {
  awsv4?: AwsV4Auth;
  basic?: BasicAuth;
  wsse?: WsseAuth;
  bearer?: BearerAuth;
  digest?: DigestAuth;
  ntlm?: NtlmAuth;
  oauth2?: OAuth2Auth;
  apikey?: ApiKeyAuth;
}

// Collection Authentication (includes mode)
export interface CollectionAuth extends RequestAuth {
  mode?: string;
}

// Body types
export interface FormUrlEncodedItem extends NameValuePair {}

export interface MultipartFormItem extends EnabledItem {
  name: string;
  value: string | string[];
  type: 'text' | 'file';
  contentType?: string;
}

export interface FileItem extends EnabledItem {
  selected: boolean;
  filePath: string;
  contentType?: string;
}

export interface GraphQLBody {
  query?: string;
  variables?: string;
}

export interface RequestBody {
  json?: string;
  text?: string;
  xml?: string;
  sparql?: string;
  formUrlEncoded?: FormUrlEncodedItem[];
  multipartForm?: MultipartFormItem[];
  file?: FileItem[];
  graphql?: GraphQLBody;
}

// Scripts
export interface Scripts {
  req?: string; // pre-request script
  res?: string; // post-response script
}

// Variables
export interface Variables {
  req?: LocalVariable[]; // pre-request variables
  res?: LocalVariable[]; // post-response variables
}

// Assertions
export interface Assertion extends NameValuePair {}

// Settings
export interface Settings {
  [key: string]: any;
}

// Main request interface for jsonToBruV2
export interface BrunoRequest {
  meta: BrunoMeta;
  http: HttpRequest;
  params?: Parameter[];
  headers?: Header[];
  auth?: RequestAuth;
  body?: RequestBody;
  script?: Scripts;
  tests?: string;
  vars?: Variables;
  assertions?: Assertion[];
  settings?: Settings;
  docs?: string;
}

// Collection-specific query parameters (different from request parameters)
export interface QueryParameter extends NameValuePair {}

// Main collection interface for jsonToCollectionBru
export interface BrunoCollection {
  meta: BrunoMeta;
  query?: QueryParameter[];
  headers?: Header[];
  auth?: CollectionAuth;
  script?: Scripts;
  tests?: string;
  vars?: Variables;
  docs?: string;
}

// Export utility types for easier usage
export type AuthType = 'awsv4' | 'basic' | 'wsse' | 'bearer' | 'digest' | 'ntlm' | 'oauth2' | 'apikey';
export type HttpMethod = HttpRequest['method'];
export type BodyType = 'json' | 'text' | 'xml' | 'sparql' | 'formUrlEncoded' | 'multipartForm' | 'file' | 'graphql';
export type OAuth2GrantType = OAuth2Auth['grantType'];
export type ParameterType = Parameter['type'];
export type ApiKeyPlacement = ApiKeyAuth['placement'];
export type TokenPlacement = OAuth2Auth['tokenPlacement'];
