import fetch from 'node-fetch';
import https from 'https';

async function testAPI() {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false }); 
        const response = await fetch("https://yaphubers.ct.ws/server/api.php", { agent });

        const text = await response.text(); 
        console.log("🔍 Raw API Response:", text);

        const data = JSON.parse(text); 
        console.log("✅ Parsed JSON:", data);
    } catch (error) {
        console.error("❌ Error testing database:", error);
    }
}

testAPI();
