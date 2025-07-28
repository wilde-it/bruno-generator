export type Collection = {
  name: string;
  description: string;
  requests: Request[];
};

export type Request = {
  name: string;
  sequence: number;
  type: "http" | "graphql";
  headers: RequestHeader[];
  authorization?: RequestAuthorization;
  details: HttpRequest | GraphQLRequest;
};

export type RequestHeader = {
  name: string;
  value: string;
};

export type RequestAuthorization = {};

export type HttpRequest = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
  body: HttpRequestBody?;
};

export type HttpRequestBody = {
  type: "json"; // TODO | "form-data" | "x-www-form-urlencoded";
  json?: string;
};

export type GraphQLRequest = {};
