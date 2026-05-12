#!/bin/bash

# Supabase Storage Setup Script
# This script helps you set up storage buckets in Supabase

echo "🚀 Mwezi Cup - Supabase Storage Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
source .env.local

# Check if required variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Missing Supabase credentials"
    echo "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""
echo "📦 Setting up storage buckets..."
echo ""

# Read the SQL migration file
MIGRATION_FILE="supabase/migrations/003_storage_setup.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo "📄 Found migration file: $MIGRATION_FILE"
echo ""

# Instructions for manual setup
echo "⚠️  Manual Setup Required"
echo "=========================="
echo ""
echo "Please follow these steps to set up storage:"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   ${SUPABASE_URL/https:\/\//https://supabase.com/dashboard/project/}"
echo ""
echo "2. Navigate to 'SQL Editor' in the left sidebar"
echo ""
echo "3. Copy and paste the contents of:"
echo "   $MIGRATION_FILE"
echo ""
echo "4. Click 'Run' to execute the migration"
echo ""
echo "Alternatively, you can:"
echo "1. Go to 'Storage' in the left sidebar"
echo "2. Manually create buckets: media, avatars, documents"
echo "3. Set up policies as described in STORAGE_SETUP.md"
echo ""
echo "📖 For detailed instructions, see: STORAGE_SETUP.md"
echo ""
echo "✨ After setup, test the upload feature at:"
echo "   http://localhost:5173/admin/blog/new"
echo ""
