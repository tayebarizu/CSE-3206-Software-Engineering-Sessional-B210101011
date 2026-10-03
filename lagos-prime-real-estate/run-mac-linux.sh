#!/usr/bin/env bash

echo "========================================================"
echo "  Starting Lagos Prime Real Estate Development Server   "
echo "========================================================"
echo ""

echo "[1/2] Installing dependencies..."
npm install

echo ""
echo "[2/2] Launching server on http://localhost:3000 ..."
npm run dev
