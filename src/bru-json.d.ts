
export interface BruRequest {
  meta?: Record<string, string>;
  http?: BruHttpConfig;
  params?: BruParam[];
  headers?: BruHeader[];
  auth?: BruAuthConfig;
  body?: BruBodyConfig;
  script?: BruScriptConfig;
  tests?: string;
  docs?: string;
  vars?: BruVarsConfig;
  assertions?: BruAssertion[];
}

export interface BruHttpConfig {
  method?: string;
  url: string;
  body?: string;
  auth?: string;
}

export interface BruParam {
  name: string;
  value: string;
  type: "query" | "path";
  enabled: boolean;
}

export interface BruHeader {
  name: string;
  value: string;
  enabled: boolean;
}

export interface BruAuthConfig {
  awsv4?: BruAwsV4Auth;
  basic?: BruBasicAuth;
  wsse?: BruWsseAuth;
  bearer?: BruBearerAuth;
  digest?: BruDigestAuth;
  ntlm?: BruNtlmAuth;
  oauth2?: BruOAuth2Auth;
  apikey?: BruApiKeyAuth;
}

export interface BruAwsV4Auth {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  service?: string;
  region?: string;
  profileName?: string;
}

export interface BruBasicAuth {
  username?: string;
  password?: string;
}

export interface BruWsseAuth {
  username?: string;
  password?: string;
}

export interface BruBearerAuth {
  token?: string;
}

export interface BruDigestAuth {
  username?: string;
  password?: string;
}

export interface BruNtlmAuth {
  username?: string;
  password?: string;
  domain?: string;
}

export interface BruOAuth2Auth {
  grantType: "password" | "authorization_code" | "client_credentials";
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
  tokenPlacement?: string;
  tokenHeaderPrefix?: string;
  tokenQueryKey?: string;
  autoFetchToken?: boolean;
  autoRefreshToken?: boolean;
}

export interface BruApiKeyAuth {
  key?: string;
  value?: string;
  placement?: string;
}

export interface BruBodyConfig {
  json?: string;
  text?: string;
  xml?: string;
  sparql?: string;
  formUrlEncoded?: BruFormUrlEncodedItem[];
  multipartForm?: BruMultipartFormItem[];
  file?: BruFileBodyItem[];
  graphql?: BruGraphQLBody;
}

export interface BruFormUrlEncodedItem {
  name: string;
  value: string;
  enabled: boolean;
}

export type BruMultipartFormItem = BruMultipartFormTextItem | BruMultipartFormFileItem;

export interface BruMultipartFormTextItem {
  name: string;
  type: "text";
  value: string;
  enabled: boolean;
  contentType?: string;
}

export interface BruMultipartFormFileItem {
  name: string;
  type: "file";
  value: string[];
  enabled: boolean;
  contentType?: string;
}

export interface BruFileBodyItem {
  selected: boolean;
  filePath?: string;
  contentType?: string;
}

export interface BruGraphQLBody {
  query: string;
  variables?: string;
}

export interface BruScriptConfig {
  req?: string;
  res?: string;
}

export interface BruVarItem {
  name: string;
  value: string;
  enabled: boolean;
  local: boolean;
}

export interface BruVarsConfig {
  req?: BruVarItem[];
  res?: BruVarItem[];
}

export interface BruAssertion {
  name: string;
  value: string;
  enabled: boolean;
}
