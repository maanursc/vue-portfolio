@echo off
echo Starting Vue Portfolio CRUD Backend Server...
echo.
echo Make sure MongoDB is running before starting the backend!
echo.
cd packages\backend
echo Starting backend on http://localhost:3001
npm run dev
pause
