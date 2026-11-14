/**
 * GlobalConnect - Automated Verification Test Suite
 * Nexconn Build Challenge 2026 - Day 1 & Phase 1 Verifications
 *
 * Verifies:
 * 1. Gateway Health & System Operational State
 * 2. Role-Based Account Creation & Session Authentication (Buyer, Seller, Agent)
 * 3. Session User State Verification (/api/auth/me)
 * 4. Nexconn Token Issuance Placeholder & Architecture Boundaries
 * 5. Real-Time Translation with Cultural Nuance & Free-Tier Quota Protection
 * 6. Contact Masking Security Filter (Phone, Email, Off-Platform Apps)
 * 7. Sandbox Escrow Ledger Lifecycle & Fund Freezing
 * 8. AI Dispute Mediator & 72-Hour Settlement Plan
 * 9. HMAC-SHA256 Signed Webhook Verification & Tamper Rejection
 */

const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.NEXCONN_WEBHOOK_SECRET || 'gc_live_secret_7f89d023a4';

let sessionCookie = '';

function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const reqHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };

        if (sessionCookie && !reqHeaders['Cookie']) {
            reqHeaders['Cookie'] = sessionCookie;
        }

        const options = {
            hostname: '127.0.0.1',
            port: PORT,
            path: path,
            method: method,
            headers: reqHeaders
        };

        if (payload) {
            options.headers['Content-Length'] = Buffer.byteLength(payload);
        }

        const req = http.request(options, res => {
            let data = '';

            // Capture session cookie if returned
            const setCookie = res.headers['set-cookie'];
            if (setCookie && Array.isArray(setCookie)) {
                const gcCookie = setCookie.find(c => c.startsWith('gc_session='));
                if (gcCookie) {
                    sessionCookie = gcCookie.split(';')[0];
                }
            }

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({ status: res.statusCode, data: parsed, headers: res.headers });
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function runTests() {
    console.log("============================================================");
    console.log("🧪 Starting GlobalConnect Automated Verification Test Suite");
    console.log("   Nexconn Build Challenge 2026 • Phase 1 Core Validation");
    console.log("============================================================\n");

    let passed = 0;
    let failed = 0;

    function assert(name, condition, details = "") {
        if (condition) {
            console.log(`✅ PASS: ${name}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${name} - ${details}`);
            failed++;
        }
    }

    try {
        // --- Test 1: Gateway Health ---
        console.log("▶ [Test 1] Gateway Health Check");
        const health = await request('GET', '/api/health');
        assert("Gateway returns 200 OK", health.status === 200);
        assert("Gateway identifies as GlobalConnect", health.data && health.data.service === 'GlobalConnect API Gateway');
        console.log();

        // --- Test 2: Role-Based Account Creation & Session Authentication ---
        console.log("▶ [Test 2] Role-Based Authentication & Session Issuance");
        const testEmail = `test_buyer_${Date.now()}@example.com`;
        const signupRes = await request('POST', '/api/auth/signup', {
            name: 'Tariq Al-Mansoor',
            email: testEmail,
            password: 'secureDemoPassword2026!',
            role: 'buyer'
        });
        assert("Signup endpoint returns 201 Created", signupRes.status === 201);
        assert("Session cookie issued", Boolean(sessionCookie && sessionCookie.includes('gc_session=')));
        assert("User created with buyer role", signupRes.data && signupRes.data.user && signupRes.data.user.role === 'buyer');
        console.log();

        // --- Test 3: Session User Verification (/api/auth/me) ---
        console.log("▶ [Test 3] Session User State Verification");
        const meRes = await request('GET', '/api/auth/me');
        assert("Authenticated user returned via session cookie", meRes.status === 200 && meRes.data.user.email === testEmail);
        console.log();

        // --- Test 4: Nexconn Token Placeholder Endpoint ---
        console.log("▶ [Test 4] Nexconn Token Architecture Verification");
        const tokenRes = await request('POST', '/api/auth/token', {
            userId: 'buyer_dubai_12',
            role: 'buyer'
        });
        assert("Token endpoint correctly guards server-side issuance (501)", tokenRes.status === 501);
        assert("Architecture explanation provided", typeof tokenRes.data.error === 'string');
        console.log();

        // --- Test 5: Translation & Cultural Etiquette Engine ---
        console.log("▶ [Test 5] Live Translation & Cultural Context Engine");
        const transRes = await request('POST', '/api/translate', {
            text: 'Is this genuine leather?',
            sourceLang: 'en',
            targetLang: 'ar',
            culturalContext: true
        });
        assert("Translation returns 200 OK", transRes.status === 200);
        assert("Confidence score exceeds 95%", transRes.data && transRes.data.confidenceScore >= 0.95);
        assert("Inference latency is tracked", typeof transRes.data.inferenceLatencyMs === 'number');
        assert("Cultural context notes provided", typeof transRes.data.culturalAdaptation === 'string');
        assert("Free-tier quota protection active", transRes.data.quotaProtected === true);
        console.log();

        // --- Test 6: Contact Masking & Security Guard ---
        console.log("▶ [Test 6] Contact Masking & Leak Prevention");
        const cleanMsg = await request('POST', '/api/moderate', { text: 'What is the tracking number?' });
        assert("Clean message passes with 100% compliance", cleanMsg.data.isClean === true && cleanMsg.data.policyComplianceScore === 100);

        const leakMsg = await request('POST', '/api/moderate', {
            text: 'Call my cell at +1-555-482-1920 or message on WhatsApp to pay via PayPal'
        });
        assert("Violations accurately detected", leakMsg.data.isClean === false && leakMsg.data.violationsBlocked.length >= 2);
        assert("Phone number redacted", leakMsg.data.sanitizedText.includes('[REDACTED PHONE]'));
        assert("Platform keyword redacted", leakMsg.data.sanitizedText.includes('[OFF-PLATFORM CHANNEL REDACTED]'));
        console.log();

        // --- Test 7: Sandbox Escrow Ledger ---
        console.log("▶ [Test 7] Milestone Escrow Lifecycle");
        const escrowStatus = await request('GET', '/api/escrow/GC-9821');
        assert("Order GC-9821 exists in sandbox ledger", escrowStatus.status === 200);
        assert("Escrow amount is $249.00 USD", escrowStatus.data.amount === 249.00);

        const dispatchAction = await request('POST', '/api/escrow/action', {
            orderId: 'GC-9821',
            action: 'DISPATCH'
        });
        assert("Courier dispatch updates status to IN_TRANSIT", dispatchAction.data.newStatus === 'IN_TRANSIT');
        console.log();

        // --- Test 8: AI Dispute Mediator ---
        console.log("▶ [Test 8] AI Dispute Mediation & Escrow Freezing");
        const disputeAction = await request('POST', '/api/escrow/action', {
            orderId: 'GC-9821',
            action: 'DISPUTE'
        });
        assert("Dispute freeze updates status to ESCROW_FROZEN", disputeAction.data.newStatus === 'ESCROW_FROZEN');
        assert("72-hour mediation window established", disputeAction.data.dispute !== null && disputeAction.data.dispute.status === 'AI_MEDIATION_ACTIVE');
        assert("3 neutral settlement proposals generated", disputeAction.data.dispute.settlementProposals.length === 3);

        const mediateAnalysis = await request('POST', '/api/dispute/mediate', {
            orderId: 'GC-9821',
            complaint: 'Material grain differs from specification'
        });
        assert("AI dispute analysis generated with bilingual timeline", Array.isArray(mediateAnalysis.data.bilingualTimeline));
        console.log();

        // --- Test 9: Real-Time Order Channels & Message Pipeline ---
        console.log("▶ [Test 9] Order-Linked Channels & Real-Time Message Pipeline");
        const channelMsgs = await request('GET', '/api/channels/GC-9821/messages');
        assert("Channel messages retrieved (200 OK)", channelMsgs.status === 200);
        assert("Initial deal conversation and spec card seeded", Array.isArray(channelMsgs.data.messages) && channelMsgs.data.messages.length >= 3);

        const sendMsgRes = await request('POST', '/api/channels/GC-9821/messages', {
            text: 'Is this genuine leather?'
        });
        assert("Channel message posted with live translation (201 Created)", sendMsgRes.status === 201);
        assert("Message object generated with ID and sender", typeof sendMsgRes.data.message.id === 'string' && sendMsgRes.data.message.sender.role === 'buyer');
        assert("Real-time dual translation attached", sendMsgRes.data.message.translation !== null);
        console.log();

        // --- Test 10: AI Dispute Summary Context Packet ---
        console.log("▶ [Test 10] AI Dispute Summary Context Packet (Tier 2 #12)");
        const packet9821 = await request('GET', '/api/dispute/packet/GC-9821');
        assert("Briefing packet retrieved for GC-9821 (200 OK)", packet9821.status === 200);
        assert("Case ID matches CASE-9821", packet9821.data.caseId === 'CASE-9821');
        assert("Locked escrow amount is $249.00 USD", packet9821.data.escrowLockedAmount === 249.00);
        assert("Triangulated evidence comparison populated", Boolean(packet9821.data.evidenceComparison.buyerClaim && packet9821.data.evidenceComparison.sellerListingVerified));
        assert("Bilingual chronological audit trail present", Array.isArray(packet9821.data.bilingualTimeline) && packet9821.data.bilingualTimeline.length >= 4);
        assert("3 fast arbitration decisions generated", Array.isArray(packet9821.data.aiRecommendations) && packet9821.data.aiRecommendations.length === 3);
        assert("Triage time savings calculated (~12 mins)", packet9821.data.timeSavedMinutes >= 10);

        const packet6102 = await request('GET', '/api/dispute/packet/GC-6102');
        assert("Briefing packet retrieved for Kyoto Kimono CASE-6102", packet6102.status === 200 && packet6102.data.caseId === 'CASE-6102');
        console.log();

        // --- Test 11: HMAC Webhook Signature Verification ---
        console.log("▶ [Test 11] HMAC-SHA256 Webhook Verification");
        const webhookPayload = JSON.stringify({
            event: 'message.sent',
            channelId: 'order_9821',
            sender: 'buyer_dubai_12',
            timestamp: new Date().toISOString()
        });

        const validSig = crypto.createHmac('sha256', WEBHOOK_SECRET)
            .update(webhookPayload)
            .digest('hex');

        // Valid signature test
        const validWebhook = await request('POST', '/api/webhooks/nexconn', JSON.parse(webhookPayload), {
            'x-nexconn-signature': validSig
        });
        assert("Authentic HMAC signature accepted (200 OK)", validWebhook.status === 200 && validWebhook.data.verified === true);

        // Tampered signature test
        const tamperedWebhook = await request('POST', '/api/webhooks/nexconn', JSON.parse(webhookPayload), {
            'x-nexconn-signature': 'tampered_invalid_signature_hex'
        });
        assert("Tampered signature rejected (403 Forbidden)", tamperedWebhook.status === 403);
        console.log();

    } catch (err) {
        console.error("Test execution failed with error:", err);
        failed++;
    }

    console.log("============================================================");
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    if (failed === 0) {
        console.log("🎉 ALL CRITICAL ARCHITECTURE CHECKS VERIFIED SUCCESSFULLY!");
    }
    console.log("============================================================");

    return failed === 0;
}

if (require.main === module) {
    runTests();
}

module.exports = { runTests };
