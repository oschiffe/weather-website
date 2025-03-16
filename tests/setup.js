// Jest setup file
jest.setTimeout(30000); // Set default timeout to 30 seconds

// Add a console log before and after each test 
beforeEach(() => {
  console.log(`\n📋 STARTING TEST: ${expect.getState().currentTestName}`);
});

afterEach(() => {
  console.log(`✅ COMPLETED TEST: ${expect.getState().currentTestName}\n`);
});

// Add any global mocks or configurations here