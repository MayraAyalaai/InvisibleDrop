const fs = require('fs');
const path = require('path');

function updateTaskAddresses(contractAddresses) {
  const tasksDir = path.join(__dirname, '../tasks');

  // Update ConfidentialCoin task
  const confidentialCoinPath = path.join(tasksDir, 'confidentialCoin.ts');
  let confidentialCoinContent = fs.readFileSync(confidentialCoinPath, 'utf8');
  confidentialCoinContent = confidentialCoinContent.replace(
    /const coin1Address = "0x[a-fA-F0-9]+"/,
    `const coin1Address = "${contractAddresses.ConfidentialCoin1}"`
  );
  confidentialCoinContent = confidentialCoinContent.replace(
    /const coin2Address = "0x[a-fA-F0-9]+"/,
    `const coin2Address = "${contractAddresses.ConfidentialCoin2}"`
  );
  fs.writeFileSync(confidentialCoinPath, confidentialCoinContent);

  // Update TestTokens task
  const testTokensPath = path.join(tasksDir, 'testTokens.ts');
  let testTokensContent = fs.readFileSync(testTokensPath, 'utf8');
  testTokensContent = testTokensContent.replace(
    /const testTokenAddress = "0x[a-fA-F0-9]+"/,
    `const testTokenAddress = "${contractAddresses.TestToken}"`
  );
  testTokensContent = testTokensContent.replace(
    /const testNFTAddress = "0x[a-fA-F0-9]+"/,
    `const testNFTAddress = "${contractAddresses.TestNFT}"`
  );
  fs.writeFileSync(testTokensPath, testTokensContent);

  // Update InvisibleDrop task
  const invisibleDropPath = path.join(tasksDir, 'invisibleDrop.ts');
  let invisibleDropContent = fs.readFileSync(invisibleDropPath, 'utf8');
  invisibleDropContent = invisibleDropContent.replace(
    /const invisibleDropAddress = "0x[a-fA-F0-9]+"/g,
    `const invisibleDropAddress = "${contractAddresses.InvisibleDrop}"`
  );
  fs.writeFileSync(invisibleDropPath, invisibleDropContent);

  console.log('✅ Task files updated with new contract addresses');
}

// If running as script
if (require.main === module) {
  const addresses = process.argv[2];
  if (addresses) {
    updateTaskAddresses(JSON.parse(addresses));
  } else {
    console.log('Usage: node updateTaskAddresses.js \'{"ConfidentialCoin1":"0x...","ConfidentialCoin2":"0x...","TestToken":"0x...","TestNFT":"0x...","InvisibleDrop":"0x..."}\'');
  }
}

module.exports = updateTaskAddresses;