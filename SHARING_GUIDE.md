# CalTrak - Family Sharing Guide

## 🌐 **Sharing Options**

### **Option 1: Local Network Sharing (Quick & Easy)**

**Your CalTrak app is accessible at:**
- **Frontend**: http://10.0.0.122:3000
- **Backend**: http://10.0.0.122:3001

**For family members to use:**
1. **Make sure both servers are running** on your computer:
   ```bash
   npm run dev    # Frontend server
   npm run server # Backend server
   ```

2. **Share the URL**: `http://10.0.0.122:3000`
   - Family members can access this from any device on your home network
   - Works on phones, tablets, laptops, etc.

3. **Requirements**:
   - All devices must be on the same WiFi network
   - Your computer must stay running
   - Both servers must stay active

---

### **Option 2: Cloud Deployment (Best for Long-term)**

#### **Deploy to Vercel (Recommended)**

1. **Create GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "CalTrak voice calorie tracker"
   git remote add origin https://github.com/yourusername/caltrak.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your CalTrak repository
   - Add environment variable:
     - Name: `VITE_ANTHROPIC_API_KEY`
     - Value: `your_anthropic_api_key_here`
   - Click "Deploy"

3. **Share the Vercel URL** (e.g., `https://caltrak-abc123.vercel.app`)

#### **Deploy to Netlify**

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Add environment variable in Site Settings
   - Share the Netlify URL

---

### **Option 3: Self-Hosted Server**

If you have a home server or VPS:

1. **Upload files** to your server
2. **Install Node.js** on the server
3. **Run**:
   ```bash
   npm install
   npm run build
   npm run server
   ```
4. **Configure reverse proxy** (nginx/Apache) to serve the app

---

## 📱 **User Experience**

### **For Family Members**

1. **Open the URL** in any web browser
2. **Create their own user account** with a unique username
3. **Set their personal goals** (calories, protein, carbs, fat)
4. **Start tracking meals** using voice input or text

### **Features Available**

- ✅ **Multi-user support** - Each person has their own data
- ✅ **Voice input** - Speak meals naturally
- ✅ **AI food analysis** - Automatic nutrition calculation
- ✅ **Progress tracking** - Visual progress bars
- ✅ **Goal celebrations** - Confetti when goals are met
- ✅ **Mobile-friendly** - Works on all devices

---

## 🔧 **Technical Requirements**

### **For Local Network Sharing**
- Your computer must stay on
- Both servers must be running
- All devices on same WiFi network

### **For Cloud Deployment**
- Internet connection required
- API key must be configured
- No local computer needed

---

## 🚀 **Quick Start Commands**

### **Local Development**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend  
npm run server

# Get your local IP
node get-ip.js
```

### **Production Build**
```bash
npm run build
# Deploy the 'dist' folder
```

---

## 💡 **Tips for Family Sharing**

1. **Create user accounts** for each family member
2. **Set realistic goals** based on individual needs
3. **Use voice input** for faster meal logging
4. **Check progress** regularly to stay motivated
5. **Celebrate achievements** together!

---

## 🆘 **Troubleshooting**

### **Can't access from other devices?**
- Check firewall settings
- Ensure all devices are on same network
- Verify both servers are running

### **Voice input not working?**
- Use Chrome, Safari, or Edge browsers
- Check microphone permissions
- Try text input as fallback

### **API errors?**
- Verify API key is configured
- Check internet connection
- Ensure backend server is running

---

**Happy tracking! 🎤🍎**