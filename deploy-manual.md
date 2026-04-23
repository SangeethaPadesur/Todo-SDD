# Manual GitHub Pages Deployment

## 🚀 Quick Manual Deployment (Guaranteed to Work)

### Step 1: Build Locally
```bash
cd c:\Sangeetha\Learnings\todo-app
npm install
npm run build
```

### Step 2: Create gh-pages Branch
```bash
git checkout --orphan gh-pages
git --work-tree dist add --all
git --work-tree dist commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force
git checkout main
```

### Step 3: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings**
3. Scroll to **Pages**
4. Set **Source: Deploy from a branch**
5. Select **gh-pages** branch and **/(root)** folder
6. Click **Save**

### Step 4: Access Your App
Your app will be available at:
```
https://[your-username].github.io/todo-app
```

## 📋 Why This Works Better
- ✅ No workflow complications
- ✅ Build happens locally (you can see errors)
- ✅ Direct deployment to gh-pages branch
- ✅ Full control over the process

## 🔧 Alternative: Use Pre-built Files
If the build fails, you can:
1. Use the existing `dist` folder
2. Skip Step 1 and go directly to Step 2

## 🎯 Troubleshooting
- If build fails: Check the error messages locally
- If deployment fails: Ensure gh-pages branch exists
- If app doesn't load: Check the base path in vite.config.ts
