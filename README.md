# ⚡ Spark Soundboard

A Lightning-enabled soundboard that lets users pay 100 sats to play sounds using Spark L2.

## Features

- Pay 100 sats via Lightning to play sounds
- No login required
- Built with Spark L2 for instant, low-fee Bitcoin payments
- Self-custodial wallet integration

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

3. **Run the server:**
```bash
npm start
```

On first run, the server will generate a new Spark wallet and display the mnemonic phrase. **Save this mnemonic to your `.env` file** as `SPARK_MNEMONIC`.

4. **Fund your wallet:**

The server will display your Spark address on startup. You can fund it by:
- Sending Bitcoin on-chain to your deposit address
- Receiving a Spark transfer from another Spark wallet
- Using a testnet faucet (for FLASHNET testnet)

5. **Add sound files:**

Place your MP3 sound files in `public/sounds/` directory:
- `airhorn.mp3`
- `drumroll.mp3`
- `tada.mp3`
- `crickets.mp3`

6. **Open the soundboard:**

Navigate to `http://localhost:3000` in your browser.

## How It Works

1. User clicks a sound button
2. Server generates a Lightning invoice for 100 sats using Spark SDK
3. User pays the invoice with any Lightning wallet
4. Server monitors for payment confirmation
5. Once paid, the sound plays automatically

## Spark L2 Fees

- **Internal Spark transfers**: 0% fee
- **Spark → Lightning**: 0.25% + routing fees
- **Lightning → Spark**: 0.15%
- **On-chain deposits/withdrawals**: Bitcoin network fees only

## Development

Run in watch mode:
```bash
npm run dev
```

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Payment**: Spark L2 SDK (`@buildonspark/spark-sdk`)
- **Network**: FLASHNET (testnet) or MAINNET

## Documentation

- [Spark Documentation](https://docs.spark.money/)
- [Spark SDK GitHub](https://github.com/buildonspark/spark)
- [Spark L2 Overview](https://docs.spark.money/spark/core-concepts)

## License

ISC
