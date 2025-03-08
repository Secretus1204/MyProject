import fetch from 'node-fetch';

const PHP_API_URL = "https://yaphubers.ct.ws/server/api.php";

async function testDatabase() {
    try {
        console.log("🔍 Testing database connection via PHP API...");
        
        
        const response = await fetch(PHP_API_URL, { method: "GET" });
        const data = await response.json();
        
        if (response.ok) {
            console.log("Database connection successful!");
            console.log("Received data:", data);
        } else {
            console.error("Failed to fetch data:", data);
        }
    } catch (error) {
        console.error("Error testing database:", error.message);
    }
}

testDatabase();
