# GitHub Deployment Guide

## Step-by-Step Process to Deploy Your Code to GitHub

### Option 1: If you already have a GitHub repository

1. **Add your GitHub repository as remote:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub username and repository name.

2. **Check if remote is added:**
   ```bash
   git remote -v
   ```

3. **Push your code to GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Option 2: If you need to create a new GitHub repository

1. **Go to GitHub.com** and create a new repository
2. **Don't initialize it with README, .gitignore, or license** (since you already have code)
3. **Copy the repository URL** (HTTPS or SSH)
4. **Run the commands from Option 1**

### Option 3: If your repository already has code and you want to merge

1. **Add remote:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   ```

2. **Fetch existing code:**
   ```bash
   git fetch origin
   ```

3. **Merge or rebase (choose one):**
   
   **Option A - Merge:**
   ```bash
   git pull origin main --allow-unrelated-histories
   git push origin main
   ```
   
   **Option B - Rebase (cleaner history):**
   ```bash
   git pull origin main --rebase --allow-unrelated-histories
   git push origin main
   ```

### What was committed:

✅ **Backend Changes:**
- OTP-based password reset system
- PasswordResetController with forgot/reset endpoints
- Otp model, repository, and service
- Updated security configuration
- Date/time parameter for ticket booking

✅ **Frontend Changes:**
- ForgotPassword and ResetPassword pages
- Date/time picker for ticket booking
- Fixed date parsing issues
- Updated API service
- Enhanced login page with forgot password link

✅ **Configuration:**
- Updated .gitignore files
- All project files

### Important Notes:

- **Never commit sensitive data** like passwords, API keys, or database credentials
- The `.gitignore` file excludes:
  - `target/` (compiled classes)
  - `node_modules/` (dependencies)
  - `.env` files (environment variables)
  - IDE-specific files

### Troubleshooting:

**If you get "repository not found" error:**
- Check your repository URL
- Ensure you have access to the repository
- Verify your GitHub credentials

**If you get "refusing to merge unrelated histories":**
- Use `--allow-unrelated-histories` flag as shown above

**If you need to update later:**
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

