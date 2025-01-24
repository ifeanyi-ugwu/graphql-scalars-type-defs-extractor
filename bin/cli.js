#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const { extractScalarTypeDefs } = require("../dist/index");

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 [options]")
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output file path for scalar type definitions",
    default: path.resolve(process.cwd(), "scalar-types.graphql"),
    normalize: true,
  })
  .option("scalars", {
    alias: "s",
    type: "array",
    description: "Specific scalar types to extract (optional)",
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Enable verbose logging",
    default: false,
  })
  .help("help")
  .alias("help", "h")
  .example(
    "$0 -o ./types/scalars.graphql",
    "Extract scalar types to a specific file"
  )
  .example("$0 -s DateTime Email", "Extract specific scalar types")
  .example(
    "$0 -o ./types/scalars.ts -s DateTime Email -v",
    "Extract specific scalars with verbose logging"
  ).argv;

try {
  // Extract scalar type definitions
  const generatedPath = extractScalarTypeDefs(
    argv.output,
    argv.scalars?.length ? argv.scalars : undefined
  );

  // Conditional logging based on verbose flag
  if (argv.verbose) {
    console.log(`✅ Scalar type definitions extracted:`);
    console.log(`   Output Path: ${generatedPath}`);
    if (argv.scalars) {
      console.log(`   Extracted Scalars: ${argv.scalars.join(", ")}`);
    }
  } else {
    console.log(`✅ Scalar type definitions extracted to: ${generatedPath}`);
  }
} catch (error) {
  console.error(`❌ Error extracting scalar types: ${error.message}`);
  process.exit(1);
}
