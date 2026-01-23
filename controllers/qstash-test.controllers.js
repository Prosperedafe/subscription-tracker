import { workflowClient } from "../config/upstash.js";
import { QSTASH_URL, SERVER_URL } from "../config/env.js";

export const testQStashConnection = async (req, res, next) => {
    try {
        const testUrl = `${SERVER_URL}/api/workflows/test`;
        const testBody = { test: true, timestamp: new Date().toISOString() };

        const result = await workflowClient.trigger({
            url: testUrl,
            body: testBody
        });

        res.status(200).json({
            success: true,
            message: "QStash connection successful! Test webhook should be received shortly.",
            data: {
                qstashUrl: QSTASH_URL,
                triggeredUrl: testUrl,
                result: result
            }
        });
    } catch (error) {
        const isConnectionRefused = error.cause?.code === 'ECONNREFUSED';
        const statusCode = isConnectionRefused ? 503 : 500;

        res.status(statusCode).json({
            success: false,
            message: isConnectionRefused
                ? "QStash server is not reachable"
                : "QStash connection failed",
            error: {
                message: error.message,
                code: error.cause?.code,
                address: error.cause?.address,
                port: error.cause?.port,
                qstashUrl: QSTASH_URL
            },
            troubleshooting: isConnectionRefused ? {
                step1: "Make sure QStash dev server is running",
                step2: "Run: npx @upstash/qstash@latest dev",
                step3: "Verify QSTASH_URL in your .env file matches the dev server URL (usually http://127.0.0.1:8080)"
            } : null
        });
    }
};

export const handleTestWebhook = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Test webhook received successfully",
        receivedAt: new Date().toISOString(),
        body: req.body
    });
};
