import { Client as WorkflowClient } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";

if (!QSTASH_URL) {
    throw new Error('QSTASH_URL is not defined');
}

if (!QSTASH_TOKEN) {
    throw new Error('QSTASH_TOKEN is not defined');
}

export const workflowClient = new WorkflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
});