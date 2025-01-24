import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { typeDefs as graphqlScalarsTypeDefs } from "graphql-scalars";

export interface ExtractScalarTypesOptions {
  output?: string;
  scalars?: string[];
  verbose?: boolean;
}

// Function to extract and write scalar type definitions
export function extractScalarTypeDefs(
  options: ExtractScalarTypesOptions = {}
): string {
  const {
    output = "scalar-types.graphql",
    scalars: scalarsToExtract,
    verbose = false,
  } = options;

  // Ensure the output directory exists
  const outputDir = path.dirname(output);
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
  const fileExt = path.extname(output);

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
  writeFileSync(output, scalarTypeDefsContent);

  if (verbose) {
    console.log(`Scalar type definitions extracted to: ${output}`);
    if (filteredScalars.length > 0) {
      console.log(
        `Extracted scalars: ${filteredScalars
          .map(extractScalarName)
          .join(", ")}`
      );
    }
  }

  return output;
}
