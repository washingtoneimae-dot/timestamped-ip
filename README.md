# Timestamped IP Registry

**Owner:** Washington Imae <washingtoneimae@gmail.com>
**GPG:** `7989 D2E2 1C9D 29E6 5742 2BCA 2B88 E816 5712 F528`
**Bit Protocol identity:** `82597114`

Public, verifiable proof that specific ideas existed at specific points in time — secured by Bitcoin and cryptographically signed.

## Verify

```bash
# Import my public key
curl -O https://raw.githubusercontent.com/washingtoneimae-dot/timestamped-ip/main/keys/washington-imae.asc
gpg --import washington-imae.asc

# Or fetch from keyserver
gpg --keyserver keys.openpgp.org --recv-keys 7989D2E21C9D29E657422BCA2B88E8165712F528

# Verify any stamped document
gpg --verify systems/stamped/sacco-system.md.asc
```

**Key locations:** Public key is in `keys/` and on `keys.openpgp.org`. Private keys are stored locally only — never shared, never committed.

## One Command

```bash
stamp my-idea.md concepts
```

That's it. It automatically:
1. GPG clearsigns the file (proves authorship)
2. Stamps the SHA-256 hash to Bitcoin testnet (proves timing)
3. Moves the file and signature to `concepts/stamped/`
4. Logs the entry in `INDEX.md`
5. Pushes everything to GitHub

Verify any stamp independently:
```bash
bit verify concepts/stamped/my-idea.md.asc --txid=<txid>
```

Or anyone can check: https://blockstream.info/testnet/tx/<txid>

## Categories

| Category | For |
|----------|-----|
| `concepts` | Theoretical ideas, algorithms, formulae |
| `protocols` | Blockchain protocols, data schemas, OP_RETURN specs |
| `designs` | System architecture, UI/UX, data models |
| `systems` | Working codebases, implementations |

## Setup (already done)

```bash
# GPG key (signing)
gpg --list-secret-keys washingtoneimae@gmail.com

# Bit Protocol (blockchain stamping)
cd ~/bit-protocol && source venv/bin/activate && bit status

# Alias (adds 'stamp' command)
alias stamp='~/.hermes/scripts/stamp.sh'
```

## Structure

```
timestamped-ip/
  README.md          ← this file
  INDEX.md           ← full stamping log with txids
  concepts/
    stamped/         ← confirmed on Bitcoin testnet
    pending/         ← drafted, not yet stamped
  protocols/stamped/ + pending/
  designs/stamped/   + pending/
  systems/stamped/   + pending/
  proofs/            ← verification scripts
```

## Verifiable Proofs

All stamps in `INDEX.md` can be independently verified against Bitcoin testnet without trusting this repo. The blockchain is the source of truth.

| # | Topic | Txid | Date |
|---|-------|------|------|
| 1 | Bit Protocol conception | [`64f0bb98...`](https://blockstream.info/testnet/tx/64f0bb98e5a90084ee4f6523fc1d96cee0634811bb08c83cfe52f2a532b05002) | 2026-06-19 |
| 2 | 5G SSB Phase-Shift Observer | [`3ed6dc22...`](https://blockstream.info/testnet/tx/3ed6dc22bd669c04620490f29e0b50adf8332e009f5e5e2786e3cc1a42048b0c) | 2026-06-19 |
| 3 | Sample file | [`b98761be...`](https://blockstream.info/testnet/tx/b98761beaf2b4e8fb60b3fe6ee767f2cb9347fb785f8b57e02328b00cef4ab4c) | 2026-06-19 |
| 4 | Decentralized Coffee Maker | [`41f431d5...`](https://blockstream.info/testnet/tx/41f431d5ab90bb7b189618772bd94d036df89eae690e00b58076b41c230270d7) | 2026-06-20 |

## Verification

Anyone can verify any stamp without this repo:

```bash
# 1. Get the file (or its SHA-256 hash)
sha256sum my-idea.md

# 2. Check the Bitcoin transaction
# OP_RETURN contains: BIT + version + type + SHA-256 hash
# https://blockstream.info/testnet/tx/<txid>

# 3. Verify GPG signature
gpg --verify my-idea.md.asc

# Or use Bit Protocol CLI
bit verify my-idea.md --txid=<txid>
```

No gatekeepers. No subscription. No disclosure. Just math.
