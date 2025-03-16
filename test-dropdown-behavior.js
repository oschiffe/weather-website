const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  console.log('Testing improved dropdown behavior...');
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('✅ Loaded the homepage');
    
    // Take initial screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'dropdown-initial.png') });
    
    // Test showing default suggested cities
    console.log('\n🔍 Testing default city suggestions...');
    await page.click('input[name="location"]');
    
    // Wait for the default suggestions to appear
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take screenshot showing default city list
    await page.screenshot({ path: path.join(screenshotsDir, 'default-city-list.png') });
    console.log('Screenshot taken of default city list');
    
    // Test hiding default suggestions during search
    console.log('\n🔍 Testing hiding default cities when searching...');
    
    // Type in the search field one character at a time
    const searchText = 'Seattle';
    // Use a more general selector that doesn't rely on placeholder or name
    await page.waitForSelector('input', { visible: true });
    const inputField = await page.$('input');
    if (!inputField) {
      console.error('❌ Could not find input field');
      return;
    }
    
    // Type into the input field we found
    for (const char of searchText) {
      await inputField.type(char);
      await new Promise(resolve => setTimeout(resolve, 150)); // Wait briefly between keypresses
    }
    
    // Take screenshot while typing
    await page.screenshot({ path: path.join(screenshotsDir, 'during-typing.png') });
    console.log('Screenshot taken while typing');
    
    // Wait for suggestions to load (or for dropdown to settle)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot after pause
    await page.screenshot({ path: path.join(screenshotsDir, 'after-typing-pause.png') });
    console.log('Screenshot taken after typing pause');
    
    // Debug dropdown presence and content
    const dropdownStatus = await page.evaluate(() => {
      const dropdown = document.querySelector('.absolute.z-50');
      const items = dropdown ? dropdown.querySelectorAll('li') : [];
      return {
        dropdownVisible: !!dropdown && dropdown.offsetParent !== null,
        numItems: items.length,
        itemTexts: Array.from(items).map(li => li.textContent.trim())
      };
    });
    console.log('Dropdown status:', JSON.stringify(dropdownStatus, null, 2));
    
    // Test selecting an item from the dropdown
    console.log('\n🔍 Testing dropdown item selection...');
    try {
      // Click the first item if we found any items
      if (dropdownStatus.numItems > 0) {
        await page.click('.absolute.z-50 li:first-child');
        console.log('Selected dropdown item');
        
        // Take screenshot after selection
        await page.screenshot({ path: path.join(screenshotsDir, 'after-selection.png') });
        
        // Wait for the weather data to load
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log('No dropdown items found to select');
      }
    } catch (error) {
      console.error('❌ Error with dropdown selection:', error.message);
    }
    
    // Test that default suggestions stay hidden after selection
    console.log('\n🔍 Testing that default cities stay hidden after selection...');
    
    // Click the input again to focus it, default cities should stay hidden
    await inputField.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take screenshot after refocusing input
    await page.screenshot({ path: path.join(screenshotsDir, 'after-refocus.png') });
    console.log('Screenshot taken after focusing input post-selection');
    
    // Test that after clearing the input, default suggestions reappear
    console.log('\n🔍 Testing default suggestions reappear after clearing input...');
    
    // Clear the input field and check if default suggestions reappear
    await inputField.click({ clickCount: 3 }); // Triple click to select all
    await page.keyboard.press('Backspace');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take screenshot after clearing input
    await page.screenshot({ path: path.join(screenshotsDir, 'after-clear.png') });
    console.log('Screenshot taken after clearing input');
    
    console.log('\n✅ Testing completed');
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})(); 