#!/bin/bash

# Exit on any error
set -e

echo "Running webpack build..."
npx webpack

echo "Build completed successfully!"

echo "Copying dist folder to desktop..."
cp -r dist /mnt/c/Users/jikae/OneDrive/Desktop

echo "Dist folder copied to desktop successfully!"
echo "Script completed!"