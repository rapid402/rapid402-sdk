#!/bin/bash
# Push only SDK files to rapid402/rapid402-sdk repository

set -e

echo "🚀 Pushing SDK to GitHub..."

# Navigate to SDK directory
cd shared/sdk

# Initialize git if needed (or reinitialize)
rm -rf .git
git init
git add .

# Commit
git commit -m "Update SDK: $(date '+%Y-%m-%d %H:%M:%S')"

# Add remote (update this with your token if needed)
git remote add origin https://github.com/rapid402/rapid402-sdk.git

# Push (force to overwrite)
git push -f origin main

echo "✅ SDK successfully pushed to GitHub!"
echo "📦 Repository: https://github.com/rapid402/rapid402-sdk"
