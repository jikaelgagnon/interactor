#!/bin/bash

# If you use Windows Subsystem for Linux, Chrome will not let you you upload the extension.
# Instead, you'll need to move it to your Windows filesystem first. This script does that
# builds the extension and moves it automatically.

# Exit on any error
set -e

echo "Running webpack build..."
npx webpack

echo "Build completed successfully!"

echo "Copying dist folder to desktop..."
cp -r dist /mnt/c/Users/jikae/OneDrive/Desktop

echo "Dist folder copied to desktop successfully!"
echo "Script completed!"