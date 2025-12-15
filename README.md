# ⚡ Spark Soundboard

A Lightning-enabled soundboard that lets users pay 100 sats to play sounds using Spark L2.

## Features

- Pay 100 sats via Lightning to play sounds
- No login required
- Built with Spark L2 for instant, low-fee Bitcoin payments
- Self-custodial wallet integration

## Quick Start

The easiest way to get started:

```bash
git clone https://github.com/echennells/spark-soundboard.git
cd spark-soundboard
npm install
npm start
```

Then open http://localhost:3000 in your browser. Sound files are included!

On first run, save the generated mnemonic to your `.env` file as `SPARK_MNEMONIC`.

## Setup Options

### Option 1: NPM (Simplest)

1. **Clone and install:**
```bash
git clone https://github.com/echennells/spark-soundboard.git
cd spark-soundboard
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

Edit `.env` and add your Spark wallet mnemonic:
```bash
SPARK_MNEMONIC=your twelve word mnemonic phrase here
SPARK_NETWORK=FLASHNET
```

If you don't have a mnemonic, just run `npm start` and one will be generated for you on first run.

3. **Start the server:**
```bash
npm start
```

4. **Open the soundboard:**
Navigate to `http://localhost:3000` in your browser.

**Note:** Sound files are already included in the repo (airhorn, drumroll, tada, crickets). You can replace them in `public/sounds/` if desired.

### Option 2: Docker

1. **Clone the repo:**
```bash
git clone https://github.com/echennells/spark-soundboard.git
cd spark-soundboard
```

2. **Create `.env` file:**
```bash
SPARK_MNEMONIC=your twelve word mnemonic phrase here
SPARK_NETWORK=FLASHNET
```

3. **Build and run with Docker:**
```bash
docker build -t spark-soundboard .
docker run -p 3000:3000 --env-file .env -e PORT=3000 spark-soundboard
```

**Note:** The `-e PORT=3000` is required to override any PORT setting in your `.env` file.

4. **Open the soundboard:**
Navigate to `http://localhost:3000` in your browser.

### Funding Your Wallet

The server will display your Spark address on startup. Fund it by:
- Sending Bitcoin on-chain to your deposit address
- Receiving a Spark transfer from another Spark wallet
- Using a testnet faucet (for FLASHNET testnet)

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
