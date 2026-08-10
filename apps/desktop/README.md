# K-Board Pro 4 Editor Desktop

# Setup build environment
- npm install -g cross-env
- nvm use 14
- npm install

# Build commands
- npm run build
- npm start

# deploy

- mac
  - npm run package-mac-dist
  - need appleId and appeIdPassword environment variables in file named “.env”
- windows
  - ’npm run package-win’ builds app and creates the exe installer
