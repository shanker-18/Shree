# PowerShell script to push code to GitHub
Write-Host "Pushing code to GitHub repository..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit: Complete Shree Raga SWAAD GHAR application with EmailJS and MongoDB integration"

# Push to master branch
Write-Host "Pushing to master branch..." -ForegroundColor Yellow
git push origin master

Write-Host "Code pushed successfully!" -ForegroundColor Green
