#!/bin/bash

# Test script for Weather Website with BrowserTools MCP integration
# This script starts the Next.js server and runs all tests

# Setup terminal colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Weather Website Test Suite${NC}"
echo "---------------------------------------"

# Check if the server is already running on port 8080
if lsof -i :8080 > /dev/null; then
  echo -e "${RED}Port 8080 is already in use. Please stop the running service first.${NC}"
  exit 1
fi

# Start the Next.js server in the background
echo -e "${YELLOW}Starting Next.js server on port 8080...${NC}"
npm run dev &
SERVER_PID=$!

# Wait for the server to be ready
echo "Waiting for server to be ready..."
sleep 10

# Run the standard MCP test
echo -e "${YELLOW}Running MCP test...${NC}"
npm run test:mcp
MCP_TEST_STATUS=$?

# Run the autocomplete MCP test
echo -e "${YELLOW}Running autocomplete MCP test...${NC}"
npm run test:autocomplete
AUTOCOMPLETE_TEST_STATUS=$?

# Start BrowserTools server (if not already running)
echo -e "${YELLOW}Starting BrowserTools server on port 8080...${NC}"
npx @agentdeskai/browser-tools-server --port 8080 &
BROWSERTOOLS_PID=$!

# Give it time to start
sleep 5

# Run the BrowserTools MCP test
echo -e "${YELLOW}Running BrowserTools MCP test...${NC}"
PORT=8080 npm run test:browsertools
BROWSERTOOLS_TEST_STATUS=$?

# Run Jest tests
echo -e "${YELLOW}Running Jest end-to-end tests...${NC}"
npm run test:e2e
JEST_TEST_STATUS=$?

# Kill the server processes
echo -e "${YELLOW}Stopping Next.js server...${NC}"
kill $SERVER_PID

echo -e "${YELLOW}Stopping BrowserTools server...${NC}"
kill $BROWSERTOOLS_PID

# Wait for the server to shut down
sleep 2

# Show test results
echo -e "${YELLOW}Test Results:${NC}"
echo "---------------------------------------"
if [ $MCP_TEST_STATUS -eq 0 ]; then
  echo -e "${GREEN}MCP test: PASSED${NC}"
else
  echo -e "${RED}MCP test: FAILED${NC}"
fi

if [ $AUTOCOMPLETE_TEST_STATUS -eq 0 ]; then
  echo -e "${GREEN}Autocomplete MCP test: PASSED${NC}"
else
  echo -e "${RED}Autocomplete MCP test: FAILED${NC}"
fi

if [ $BROWSERTOOLS_TEST_STATUS -eq 0 ]; then
  echo -e "${GREEN}BrowserTools MCP test: PASSED${NC}"
else
  echo -e "${RED}BrowserTools MCP test: FAILED${NC}"
fi

if [ $JEST_TEST_STATUS -eq 0 ]; then
  echo -e "${GREEN}Jest tests: PASSED${NC}"
else
  echo -e "${RED}Jest tests: FAILED${NC}"
fi

echo "---------------------------------------"

# Set script permissions
chmod +x ./test-all.sh

# Determine overall status
if [ $MCP_TEST_STATUS -eq 0 ] && [ $AUTOCOMPLETE_TEST_STATUS -eq 0 ] && [ $BROWSERTOOLS_TEST_STATUS -eq 0 ] && [ $JEST_TEST_STATUS -eq 0 ]; then
  echo -e "${GREEN}All tests PASSED!${NC}"
  exit 0
else
  echo -e "${RED}Some tests FAILED!${NC}"
  exit 1
fi