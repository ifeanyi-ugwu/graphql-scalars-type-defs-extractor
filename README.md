# GraphQL Scalars TypeDefs Extractor

A utility to manage and generate scalar type definitions from `graphql-scalars` for seamless integration with GraphQL projects.

## Why?

GraphQL Codegen often fails to recognize scalar type definition strings imported from `graphql-scalars`, leading to errors like:

```plaintext
❯ Generate to src/types/resolvers-types.generated.ts
  ✖
    Failed to load schema from ./src/**/*.ts:
    Unknown type: "Date".
    Error: Unknown type: "Date".
```

This tool automatically generates a reusable type definition from `graphql-scalars`, ensuring that `codegen` recognizes the custom scalar types.

It generates scalar type definitions in either GraphQL SDL format or as a `gql`-tagged (from `graphql-tag`) GraphQL template literal, depending on the file extension specified in the output option.

## Installation

```bash
npm install graphql-scalars-type-defs-extractor
# or
yarn add graphql-scalars-type-defs-extractor
```

## Usage

### CLI

```bash
# Output to a GraphQL file
npx graphql-scalars-type-defs-extractor -o ./scalar-types.graphql

# Output to a TypeScript file
npx graphql-scalars-type-defs-extractor -o ./scalar-types.ts

# Output to a JavaScript file
npx graphql-scalars-type-defs-extractor -o ./scalar-types.js

# Output specific scalar types (e.g., DateTime, Email)
npx graphql-scalars-type-defs-extractor -s DateTime Email

# Output with verbose logging
npx graphql-scalars-type-defs-extractor -o ./scalar-types.graphql -v

# Example combining options
npx graphql-scalars-type-defs-extractor -o ./types/scalars.ts -s DateTime Email -v
```

#### CLI Options

- **`-o, --output`**: Specify the output file path (e.g., `./types/scalars.graphql` or `./types/scalars.ts`). Defaults to `scalar-types.graphql`.
- **`-s, --scalars`**: List of specific scalar types to extract. If not provided, all scalars will be extracted.
- **`-v, --verbose`**: Enable verbose logging to see detailed output during extraction.
- **`-h, --help`**: Show help information.

### In Codegen Configuration

```typescript
import { extractScalarTypeDefs } from "graphql-scalars-type-defs-extractor";

const scalarTypesPath = extractScalarTypeDefs({
  output: "scalar-types.graphql",
  scalars: ["DateTime", "Email"],
});

const config = {
  schema: [
    "./src/**/*.ts",
    scalarTypesPath, // Add only if the generated scalar types file is not already covered by the schema's watch pattern
  ],
  generates: {
    "src/types/resolvers-types.generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
```

#### `extractScalarTypeDefs`'s Parameters

- **`options`**: An object with the following properties:
  - **`output`**: Custom file path (`.graphql`, `.ts`, `.js`). Defaults to `scalar-types.graphql`.
  - **`scalars`**: An optional array of specific scalar types to extract (e.g., `["DateTime", "Email"]`). If not provided, all scalars will be extracted.
  - **`verbose`**: A boolean flag to enable verbose logging (default is `false`).

## Compatibility

- Requires **`graphql-scalars`** and **`graphql-tag`** (for `.ts`/`.js` output)

## License

MIT
