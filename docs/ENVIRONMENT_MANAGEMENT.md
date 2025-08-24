# Environment Management

This project uses a secure environment management system that prevents hardcoded secrets from being committed to version control.

## Initial Setup

1. **Run the setup command:**

   ```bash
   ./scripts/env-manager.sh setup
   ```

2. **Create your secrets file:**

   ```bash
   cp .env.secrets.template .env.secrets
   ```

3. **Fill in your real secrets in `.env.secrets`:**

   ### Development Secrets (Already Provided)

   The development secrets use Supabase emulator defaults and are safe to use as-is.

   ### Production Secrets (You Need to Fill These)

   - **Supabase**: Get from your Supabase project dashboard → Settings → API
   - **Firebase**: Get from Firebase console → Project Settings → General

4. **Create environment files:**

   ```bash
   ./scripts/env-manager.sh create-env
   ```

## Usage

### Development

```bash
# Switch to development environment
./scripts/env-manager.sh dev

# Start complete development environment
./scripts/env-manager.sh start
```

### Production

```bash
# Switch to production environment
./scripts/env-manager.sh prod

# Deploy to production
./scripts/env-manager.sh deploy
```

### Utilities

```bash
# Check current environment
./scripts/env-manager.sh status

# Clean up build artifacts and stop services
./scripts/env-manager.sh clean
```

## Security Notes

- **Never commit `.env.secrets`** - it's in `.gitignore`
- **Never hardcode secrets** in any tracked files
- **Use environment variables** for CI/CD pipelines
- **Rotate secrets regularly** in production

## File Structure

```
.env.secrets.template  # Template with placeholder values (tracked)
.env.secrets          # Real secrets (not tracked - YOU CREATE THIS)
.env.template         # Environment template (tracked)
.env.development      # Generated development config (not tracked)
.env.production       # Generated production config (not tracked)
.env                  # Active environment config (not tracked)
```

## Troubleshooting

### Missing secrets error

If you get "Missing .env.secrets file!", follow the setup steps above.

### Permission denied

Make sure the script is executable:

```bash
chmod +x scripts/env-manager.sh
```

### Wrong environment

Check your current environment:

```bash
./scripts/env-manager.sh status
```
