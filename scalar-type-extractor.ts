import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { typeDefs as graphqlScalarsTypeDefs } from "graphql-scalars";

// Function to extract and write scalar type definitions
export function extractScalarTypeDefs(
  outputPath: string = "scalar-types.graphql"
) {
  // Ensure the output directory exists
  const outputDir = path.dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Determine the file extension
  const fileExt = path.extname(outputPath);

  // Decide on the content based on the file extension
  let scalarTypeDefsContent: string;

  if (fileExt === ".graphql") {
    // If .graphql, just output the raw SDL
    scalarTypeDefsContent = graphqlScalarsTypeDefs
      .map((def) => def.toString())
      .join("\n");
  } else {
    // For other extensions (like .ts, .js), use gql tag
    scalarTypeDefsContent = `
import gql from 'graphql-tag';

export const scalarTypeDefs = gql\`
  ${graphqlScalarsTypeDefs.map((def) => def.toString()).join("\n")}
\`;
`;
  }

  // Write the scalar type definitions to the specified file
  writeFileSync(outputPath, scalarTypeDefsContent);

  console.log(`Scalar type definitions extracted to: ${outputPath}`);

  return outputPath;
}

// If run directly as a script
if (require.main === module) {
  // Default to .graphql extension if not specified
  const outputPath = process.argv[2] || "scalar-types.graphql";
  extractScalarTypeDefs(outputPath);
}
