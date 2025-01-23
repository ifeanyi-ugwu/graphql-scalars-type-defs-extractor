import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { typeDefs as graphqlScalarsTypeDefs } from "graphql-scalars";

// Function to extract and write scalar type definitions
export function extractScalarTypeDefs(
  outputPath: string = "scalar-types.graphql",
  scalarsToExtract?: string[] // Optional array of scalar names
) {
  // Ensure the output directory exists
  const outputDir = path.dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Helper: Extract scalar name from SDL string
  const extractScalarName = (sdl: string) => {
    const match = sdl.match(/^scalar (\w+)/);
    return match ? match[1] : null; // Return scalar name or null if not found
  };

  // Create a set of available scalars for quicker lookup
  const availableScalarsSet = new Set(
    graphqlScalarsTypeDefs.map(extractScalarName).filter(Boolean)
  );

  // Filter scalars if scalarsToExtract is provided
  const filteredScalars = scalarsToExtract
    ? graphqlScalarsTypeDefs.filter((def) => {
        const scalarName = extractScalarName(def);
        return scalarName && scalarsToExtract.includes(scalarName);
      })
    : graphqlScalarsTypeDefs; // If no scalars provided, extract all

  // Identify scalars that couldn't be found
  if (scalarsToExtract) {
    const notFoundScalars = scalarsToExtract.filter(
      (scalar) => !availableScalarsSet.has(scalar)
    );

    if (notFoundScalars.length > 0) {
      console.warn(
        `Scalar type(s) not found in graphql-scalars module: ${notFoundScalars.join(
          ", "
        )}`
      );
    }
  }

  // Determine the file extension
  const fileExt = path.extname(outputPath);

  // Decide on the content based on the file extension
  let scalarTypeDefsContent: string;

  if (fileExt === ".graphql") {
    // If .graphql, just output the raw SDL
    scalarTypeDefsContent = filteredScalars.join("\n");
  } else {
    // For other extensions (like .ts, .js), use gql tag
    scalarTypeDefsContent = `
import gql from 'graphql-tag';

export const scalarTypeDefs = gql\`
  ${filteredScalars.join("\n")}
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
  const scalarsToExtract = process.argv.slice(3); // Get scalars from CLI arguments
  extractScalarTypeDefs(
    outputPath,
    scalarsToExtract.length ? scalarsToExtract : undefined
  );
}
