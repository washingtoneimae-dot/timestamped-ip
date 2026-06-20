# Timestamped IP Registry

**Owner:** Washington Imae <washingtoneimae@gmail.com>
**GPG:** `7989 D2E2 1C9D 29E6 5742 2BCA 2B88 E816 5712 F528`
**Bit Protocol identity:** `82597114`

## Structure

```
timestamped-ip/
  README.md          ← this file
  INDEX.md           ← stamped IP log (date, hash, txid, topic)
  concepts/          ← theoretical ideas, algorithms, formulae
    stamped/         ← confirmed on Bitcoin testnet
    pending/         ← drafted, not yet stamped
  protocols/         ← blockchain protocols, data schemas
  designs/           ← system architecture, UI/UX
  systems/           ← working codebases, implementations
  proofs/            ← gpg signatures, verification scripts
```

## Workflow

```bash
# 1. Write idea
vim concepts/pending/my-idea.md

# 2. GPG sign
gpg --clearsign concepts/pending/my-idea.md
mv my-idea.md.asc concepts/pending/

# 3. Stamp to Bitcoin testnet
cd ~/bit-protocol && source venv/bin/activate
bit stamp ~/timestamped-ip/concepts/pending/my-idea.md.asc

# 4. Move to stamped/
mv concepts/pending/my-idea.md* concepts/stamped/

# 5. Log it
# Add entry to INDEX.md
```

## Already stamped (in bit-protocol repo)

| Topic | Txid | Date |
|-------|------|------|
| Bit Protocol conception | `64f0bb98...` | 2026-06-19 |
| 5G SSB Phase-Shift Observer | `3ed6dc22...` | 2026-06-19 |
| Sample file | `b98761be...` | 2026-06-19 |
