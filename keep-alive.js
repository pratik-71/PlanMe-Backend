#!/usr/bin/env node

/**
 * PlanMe Keep-Alive Script
 * 
 * This script pings your Render backend server every 10 minutes
 * to prevent it from going to sleep on the free plan.
 * 
 * Usage:
 *   node keep-alive.js
 *   node keep-alive.js --url https://your-server.com --interval 10
 */

const https = require('https');
const http = require('http');

// Configuration
const DEFAULT_URL = 'https://planme-backend-eduf.onrender.com';
const DEFAULT_INTERVAL = 10; // minutes

// Parse command line arguments
const args = process.argv.slice(2);
let serverUrl = DEFAULT_URL;
let intervalMinutes = DEFAULT_INTERVAL;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && args[i + 1]) {
    serverUrl = args[i + 1];
    i++;
  } else if (args[i] === '--interval' && args[i + 1]) {
    intervalMinutes = parseInt(args[i + 1]);
    i++;
  }
}

const pingUrl = `${serverUrl}/api/health`;
const intervalMs = intervalMinutes * 60 * 1000;

console.log('🚀 PlanMe Keep-Alive Service Started');
console.log(`📡 Server URL: ${serverUrl}`);
console.log(`⏰ Ping Interval: ${intervalMinutes} minutes`);
console.log(`🔗 Ping Endpoint: ${pingUrl}`);
console.log('');

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function pingServer() {
  return new Promise((resolve) => {
    const url = new URL(pingUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': 'PlanMe-KeepAlive/1.0',
        'Connection': 'keep-alive'
      },
      timeout: 10000
    };

    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            log(`✅ Ping successful - Server is alive (uptime: ${Math.round(response.uptime)}s)`);
            resolve(true);
          } catch (error) {
            log(`✅ Ping successful - Server responded (status: ${res.statusCode})`);
            resolve(true);
          }
        } else {
          log(`❌ Ping failed - Status: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ Ping error: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      log(`❌ Ping timeout after 10 seconds`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function startKeepAlive() {
  log('Starting keep-alive service...');
  
  // Ping immediately
  await pingServer();
  
  // Set up interval
  setInterval(async () => {
    await pingServer();
  }, intervalMs);
  
  log(`Keep-alive service running (pinging every ${intervalMinutes} minutes)`);
  log('Press Ctrl+C to stop');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Keep-alive service stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Keep-alive service stopped');
  process.exit(0);
});

// Start the service
startKeepAlive().catch((error) => {
  console.error('❌ Failed to start keep-alive service:', error.message);
  process.exit(1);
});
