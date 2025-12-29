#!/bin/bash
# Build Android APK for Amazon Appstore
# Run this script on your local machine with internet access

set -e

echo "🔧 Building BestMealMate Android APK..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Build APK
echo "🏗️ Building release APK..."
cd android
chmod +x gradlew
./gradlew assembleRelease

# Show output location
echo ""
echo "✅ Build complete!"
echo ""
echo "📱 APK location:"
echo "   android/app/build/outputs/apk/release/app-release-unsigned.apk"
echo ""
echo "📦 For Amazon Appstore, upload the APK file above."
