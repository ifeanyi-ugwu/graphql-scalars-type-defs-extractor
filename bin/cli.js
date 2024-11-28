#!/usr/bin/env node
const { extractScalarTypeDefs } = require("../dist/index");
const path = require("path");

// Default output path
const defaultOutputPath = path.resolve(process.cwd(), "scalar-types.graphql");

// Get output path from command line argument or use default
const outputPath = process.argv[2] || defaultOutputPath;

try {
  const generatedPath = extractScalarTypeDefs(outputPath);
  console.log(`✅ Scalar type definitions extracted to: ${generatedPath}`);
} catch (error) {
  console.error(`❌ Error extracting scalar types: ${error.message}`);
  process.exit(1);
}
