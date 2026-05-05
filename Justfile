# Course Manager Frontend — common commands
# Package manager: pnpm

default:
    @just --list

# Install dependencies
install:
    pnpm install

# Start development server (localhost:3000)
dev:
    pnpm dev

# Production build
build:
    pnpm build

# Run production build (after `just build`)
start:
    pnpm start

# Run ESLint
lint:
    pnpm lint

# Fix lint issues automatically
lint-fix:
    pnpm lint --fix

# Check TypeScript types without emitting
typecheck:
    pnpm exec tsc --noEmit

# Remove build artifacts and Next.js cache
clean:
    rm -rf .next out

# Full reset: clean, reinstall, build
reset: clean
    rm -rf node_modules
    pnpm install
    pnpm build

# Copy env example (only if .env.local does not exist yet)
env:
    cp -n .env.example .env.local && echo ".env.local created" || echo ".env.local already exists"
