# GraphQL Scalars Extractor

A utility to manage and generate scalar type definitions from `graphql-scalars` for seamless integration with GraphQL projects.

---

## Why?

**GraphQL Codegen** often fails to recognize scalar types from `graphql-scalars`. Instead of manually redefining scalars, this tool automates extraction and ensures compatibility.

---

## Features

- 🚀 **Automated scalar extraction** for `graphql-scalars`
- 🔧 Integrates with **GraphQL Codegen**
- 📦 Supports multiple formats: `.graphql`, `.ts`, `.js`
- 💡 Compatible with TypeScript and JavaScript

---

## Installation

```bash
npm install graphql-scalars-type-defs-extractor
# or
yarn add graphql-scalars-type-defs-extractor
```

---

## Usage

### CLI

```bash
# Output to GraphQL file
npx graphql-scalars-type-defs-extractor scalar-types.graphql

# Output to TypeScript (default)
npx graphql-scalars-type-defs-extractor scalar-types.ts
```

### In Codegen Configuration

```typescript
import { extractScalarTypeDefs } from "graphql-scalars-type-defs-extractor";

const scalarTypesPath = extractScalarTypeDefs("scalar-types.graphql");

const config = {
  schema: [
    "./src/**/*.ts",
    scalarTypesPath, // Add scalars to the schema
  ],
  generates: {
    "src/types/resolvers-types.generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
```

### Pre-build Script

```json
{
  "scripts": {
    "extract-scalars": "graphql-scalars-type-defs-extractor",
    "generate": "npm run extract-scalars && graphql-codegen"
  }
}
```

---

## Output

### GraphQL File (`.graphql`)

Raw SDL format:

```graphql
scalar EmailAddress
scalar GUID
# ...other scalars
```

### TypeScript File (`.ts`)

GraphQL template literal:

```typescript
import gql from "graphql-tag";

export const scalarTypeDefs = gql`
  scalar EmailAddress
  scalar GUID
  # ...other scalars
`;
```

---

## API

### `extractScalarTypeDefs(outputPath?: string): string`

Extracts scalar definitions to the specified file.

- **`outputPath`**: Custom file path (`.graphql`, `.ts`, `.js`). Defaults to `scalar-types.graphql`.
- **Returns**: Path of the generated file.

---

## Compatibility

- Requires **`graphql-scalars`** and **`graphql-tag`**(if generating to a `.ts` or `.js` path).
- Fully supports **GraphQL Codegen** and both TypeScript/JavaScript projects.

**Eliminates errors like this with Codegen:**

```plaintext
❯ Generate to src/types/resolvers-types.generated.ts
  ✖
    Failed to load schema from ./src/**/*.ts:
    Unknown type: "Date".
    Error: Unknown type: "Date".
```

**No more manual scalar redefinitions!** 🚀

## License

MIT
