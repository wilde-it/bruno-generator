import { jsonToBruV2 } from "@usebruno/lang";
import type { BruRequest } from "./bru-json";

const foo: BruRequest = {
  meta: {
    name: "foo",
    type: "http",
    seq: "1",
  },

  http: {
    method: "POST",
    url: "https://example.com",
  },

  body: {
    json: '{"foo": "bar"}',
    graphql: {
      query: "query { foo }",
      variables: `{
        foo: "bar",
      }`,
    },
  },
};

const bruFileContent = jsonToBruV2(foo);
console.log(bruFileContent);
