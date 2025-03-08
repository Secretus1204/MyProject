import fetch from 'node-fetch';
import https from 'https';

async function testAPI() {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false }); 
        const response = await fetch("https://yaphubers.ct.ws/server/api.php", { agent });

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        
        const data = await response.json();
        console.log("✅ API Response:", data);
    } catch (error) {
        console.error("❌ Error testing database:", error);
    }
}

testAPI();
