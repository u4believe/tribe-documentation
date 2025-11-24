# Cleanup Instructions

If you're still seeing old tutorial documentation, follow these steps:

## Step 1: Stop the Dev Server
If `npm start` is running, press `Ctrl+C` to stop it.

## Step 2: Close File Explorer
Close any Windows File Explorer windows that might have the `my-website` folder open.

## Step 3: Clear Build Cache
Run these commands in PowerShell:

```powershell
cd C:\Users\HP\tribe-doc
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .docusaurus -ErrorAction SilentlyContinue
```

## Step 4: Delete my-website Folder (if not locked)
```powershell
Remove-Item -Recurse -Force my-website -ErrorAction SilentlyContinue
```

## Step 5: Clear Browser Cache
- **Chrome/Edge**: Press `Ctrl+Shift+Delete` → Clear cached images and files
- **Or use Incognito/Private mode**: `Ctrl+Shift+N`

## Step 6: Rebuild and Start
```powershell
npm run build
npm start
```

## Step 7: Open in Browser
Navigate to `http://localhost:3000` in a fresh/incognito browser window.

---

**Note:** The `my-website` folder is from the initial Docusaurus setup and can be safely deleted. It doesn't affect your current documentation which is in the root `docs/` folder.

