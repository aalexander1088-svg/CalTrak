# CalTrak - Vercel Deployment Guide

## 🚀 **Quick Deployment Steps**

### **Step 1: Push to GitHub**
```bash
# Add your GitHub repository URL (replace YOUR_GITHUB_URL)
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### **Step 2: Deploy to Vercel**
1. **Go to**: [vercel.com](https://vercel.com)
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "New Project"
   - Find your `caltrak` repository
   - Click "Import"

### **Step 3: Configure Environment Variables**
In Vercel project settings:
- **Name**: `VITE_ANTHROPIC_API_KEY`
- **Value**: `your_anthropic_api_key_here`
- **Environments**: Production, Preview, Development

### **Step 4: Deploy**
Click "Deploy" and wait for completion.

## 🌐 **Your App Will Be Live At**
`https://caltrak-abc123.vercel.app` (your unique URL)

## 📱 **Share with Family**
Send them the Vercel URL - they can access it from any device!

## ✅ **What's Included**
- ✅ **Voice input** with Web Speech API
- ✅ **AI food analysis** with Claude API
- ✅ **Multi-user support** with localStorage
- ✅ **Progress tracking** with visual indicators
- ✅ **Mobile-responsive** design
- ✅ **Serverless backend** (no server needed)

## 🔧 **Technical Details**
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Vercel serverless functions
- **AI**: Claude API integration
- **Storage**: Browser localStorage
- **Deployment**: Vercel (free tier)

## 🎯 **Ready to Share!**
Once deployed, your family can:
1. Open the Vercel URL
2. Create their own user accounts
3. Set personal nutrition goals
4. Track meals with voice input
5. Monitor progress with visual indicators

**No server maintenance required!** 🎉
