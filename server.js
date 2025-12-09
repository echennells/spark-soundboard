const express = require('express');
const cors = require('cors');
const path = require('path');
const { SparkWallet } = require('@buildonspark/spark-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Spark wallet
let sparkWallet = null;

async function initializeWallet() {
  try {
    if (!process.env.SPARK_MNEMONIC) {
      console.error('❌ SPARK_MNEMONIC not found in .env file');
      process.exit(1);
    }

    const { wallet } = await SparkWallet.initialize({
      mnemonicOrSeed: process.env.SPARK_MNEMONIC,
      options: {
        network: process.env.SPARK_NETWORK || "MAINNET",
      },
    });

    sparkWallet = wallet;

    console.log('✅ Spark wallet initialized');

    const balance = await sparkWallet.getBalance();
    console.log('💰 Wallet balance:', balance.confirmedSats, 'sats');

    const sparkAddress = await sparkWallet.getSparkAddress();
    console.log('📍 Spark address:', sparkAddress);

  } catch (error) {
    console.error('❌ Failed to initialize Spark wallet:', error);
    process.exit(1);
  }
}

// Start monitoring for payments
async function monitorPayments() {
  if (!sparkWallet) return;

  try {
    // Check for recent transfers
    const transfersResponse = await sparkWallet.getTransfers(10, 0);
    const transfers = transfersResponse?.transfers || [];

    // Mark any pending payments as paid if we see a completed transfer
    for (const [paymentId, payment] of pendingPayments.entries()) {
      if (payment.paid) continue;

      // Check if this payment hash appears in recent transfers with TRANSFER_COMPLETED status
      const matchingTransfer = transfers.find(t =>
        t.userRequest?.invoice?.paymentHash === payment.paymentHash &&
        t.userRequest?.status === 'TRANSFER_COMPLETED'
      );

      if (matchingTransfer) {
        payment.paid = true;
        console.log(`✅ Payment received for ${SOUNDS.find(s => s.id === payment.soundId)?.name}`);
        console.log(`   Amount: ${matchingTransfer.totalValue} sats`);
      }
    }
  } catch (error) {
    console.error('Error monitoring payments:', error.message);
  }
}

// Poll for payments every 3 seconds
setInterval(monitorPayments, 3000);

initializeWallet();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Available sounds
const SOUNDS = [
  { id: 'airhorn', name: 'Air Horn', file: 'airhorn.mp3' },
  { id: 'drumroll', name: 'Drum Roll', file: 'drumroll.mp3' },
  { id: 'tada', name: 'Ta-Da!', file: 'tada.mp3' },
  { id: 'crickets', name: 'Crickets', file: 'crickets.mp3' },
];

const PRICE_SATS = 100;

// Store pending payments (in production, use a database)
const pendingPayments = new Map();

// API Routes

// Get available sounds
app.get('/api/sounds', (req, res) => {
  res.json(SOUNDS);
});

// Create invoice for a sound
app.post('/api/sounds/:soundId/invoice', async (req, res) => {
  try {
    const { soundId } = req.params;
    const sound = SOUNDS.find(s => s.id === soundId);

    if (!sound) {
      return res.status(404).json({ error: 'Sound not found' });
    }

    if (!sparkWallet) {
      return res.status(503).json({ error: 'Wallet not initialized' });
    }

    // Create Lightning invoice using Spark SDK
    const invoiceResponse = await sparkWallet.createLightningInvoice({
      amountSats: PRICE_SATS,
      memo: `Spark Soundboard: ${sound.name}`,
      expirySeconds: 300, // 5 minutes
    });

    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const encodedInvoice = invoiceResponse.invoice.encodedInvoice;
    const paymentHash = invoiceResponse.invoice.paymentHash;

    // Store payment info
    pendingPayments.set(paymentId, {
      soundId,
      encodedInvoice,
      paymentHash,
      paid: false,
      createdAt: Date.now(),
    });

    console.log(`📄 Created invoice for ${sound.name}`);
    console.log(`   Payment hash: ${paymentHash}`);
    console.log(`   Invoice: ${encodedInvoice.substring(0, 50)}...`);

    res.json({
      paymentId,
      invoice: encodedInvoice,
      amountSats: PRICE_SATS,
      soundId: sound.id,
      soundName: sound.name,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Check payment status
app.get('/api/payments/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  const payment = pendingPayments.get(paymentId);

  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  res.json({
    paymentId,
    soundId: payment.soundId,
    paid: payment.paid,
  });
});

// Webhook for payment confirmation (from Spark)
app.post('/api/webhooks/payment', (req, res) => {
  // TODO: Verify webhook signature
  const { paymentId } = req.body;

  if (pendingPayments.has(paymentId)) {
    pendingPayments.get(paymentId).paid = true;
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🎵 Spark Soundboard server running on http://localhost:${PORT}`);
  console.log(`💰 Price per sound: ${PRICE_SATS} sats`);
});
