@echo off
echo ==================================================
echo          Shree Raaga Swaad Ghar Deployment
echo ==================================================
echo.

echo Building the application...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo Build failed! Please check for errors.
    pause
    exit /b 1
)

echo.
echo Build successful! Deploying to production...
echo Domain: www.shreeraagaswaadghar.com
echo.

echo Setting environment variables...
call vercel env add MONGODB_URI production
echo Enter: mongodb+srv://shreeraagaswaadghar:shreeraagaswaadghar@shreeraagaswaadghar.zmnjcdo.mongodb.net/?retryWrites=true^&w=majority^&appName=ShreeRaagaSWAADGHAR
echo.

call vercel env add NODE_ENV production  
echo Enter: production
echo.

echo Deploying to production...
call vercel --prod

echo.
echo ==================================================
echo            Deployment Complete!
echo ==================================================
echo Your site should be live at:
echo https://www.shreeraagaswaadghar.com
echo.
echo Please test the following:
echo - No console errors
echo - Order placement works
echo - Email notifications work
echo - API endpoints respond correctly
echo.
pause
