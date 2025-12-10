# 🚀 Running the Frontend

## Quick Start

### Option 1: Using npm directly
```bash
cd frontend
npm install
npm run dev
```

### Option 2: Using the script (Windows)
**PowerShell:**
```powershell
cd frontend
.\run-frontend.ps1
```

**Command Prompt (Batch):**
```cmd
cd frontend
run-frontend.bat
```

## What happens?

1. **First time**: The script will automatically install dependencies if `node_modules` doesn't exist
2. **Then**: Starts the Vite development server
3. **Opens**: Automatically opens your browser at `http://localhost:3000`

## Manual Commands

If you prefer to run commands manually:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production

## Troubleshooting

- **Port already in use?** The server runs on port 3000. Make sure nothing else is using it.
- **Dependencies not installing?** Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.
- **Module errors?** Make sure you're in the `frontend` directory when running commands.










