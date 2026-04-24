#!/bin/bash

echo "🌿 Starting Nisakorn Garden deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 Checking current directory...${NC}"
pwd

echo -e "${BLUE}🔍 Checking if git is initialized...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${GREEN}🚀 Initializing git repository...${NC}"
    git init
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi

echo -e "${BLUE}📦 Adding all files to git...${NC}"
git add .

echo -e "${BLUE}💬 Creating commit...${NC}"
git commit -m "🌿 Initial commit: Nisakorn Garden E-commerce Platform

- Multi-role system (B2C, B2B, Staff, Admin)
- Responsive design with Thai language support
- Interactive dashboards and shopping cart
- Professional UI/UX for fruit delivery business"

echo -e "${BLUE}🌿 Setting main branch...${NC}"
git branch -M main

echo -e "${BLUE}🔗 Adding remote repository...${NC}"
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Remote already exists${NC}"
else
    git remote add origin https://github.com/mazmaker/nisakorn-garden.git
fi

echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo -e "${GREEN}📝 Repository: https://github.com/mazmaker/nisakorn-garden${NC}"
    echo -e "${BLUE}🌐 Next steps:${NC}"
    echo -e "  1. Go to https://vercel.com"
    echo -e "  2. Sign in with GitHub"
    echo -e "  3. Import 'mazmaker/nisakorn-garden'"
    echo -e "  4. Deploy!"
else
    echo -e "${RED}❌ Push failed. You might need to login to GitHub first.${NC}"
    echo -e "${BLUE}💡 Try running: gh auth login${NC}"
fi

echo -e "${GREEN}🎉 Deployment script completed!${NC}"