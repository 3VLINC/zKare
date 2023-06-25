#!/bin/sh

# This script generates the ABI files for the contracts in the project.
# It is intended to be run from the project root directory
# the generated ABI will be used to call the contracts from the frontend
mkdir -p ./abi/
touch ./abi/ZKare.json

echo "{\n  \"abi\": $(forge inspect ZKare abi)\n}" >| ./abi/ZKare.json