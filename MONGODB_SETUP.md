# MongoDB Atlas Configuration Summary

## Connection Details

**Connection String:**
```
mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector?retryWrites=true&w=majority
```

**Breakdown:**
- **Protocol:** `mongodb+srv://`
- **Username:** `adityaparihar450_db_user`
- **Password:** `lg3wv4O9K308IVRS`
- **Cluster:** `cluster.jkvnyrj.mongodb.net`
- **Database:** `phish_detector`
- **Options:** `retryWrites=true&w=majority`

## Required MongoDB Atlas Configuration

### 1. Network Access
⚠️ **IMPORTANT:** You must allow Render to connect to your database.

1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** in left sidebar
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

> **Note:** Render uses dynamic IP addresses, so you must allow all IPs or add Render's IP ranges.

### 2. Database User Permissions
Verify your user has appropriate permissions:

1. Go to **Database Access** in MongoDB Atlas
2. Find user: `adityaparihar450_db_user`
3. Ensure role is **Atlas Admin** or at least **Read and Write to any database**

### 3. Cluster Status
- Ensure your cluster is **active** and not paused
- Free tier (M0) is sufficient for development
- Monitor usage in Atlas dashboard

## Database Structure

Your application will create these collections:
- `users` - User accounts and authentication
- `urlscans` - URL scan history and results
- `threatfeeds` - Threat intelligence data

## Testing Connection

### From Local Machine (PowerShell)
```powershell
# Using MongoDB Shell (if installed)
mongosh "mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector"

# Or test with Node.js
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector').then(() => console.log('Connected!')).catch(err => console.error('Error:', err));"
```

### From Render (After Deployment)
Connection will be tested automatically when backend starts. Check logs:
```
MongoDB connected successfully
Server running on port 5000 in production mode
```

## Security Recommendations

### ⚠️ Important Security Notes:

1. **Rotate Password Periodically**
   - Go to Database Access → Edit User → Edit Password
   - Update in all Render environment variables

2. **Use Environment Variables**
   - Never commit connection strings to git
   - Always use Render environment variables

3. **Monitor Access**
   - Review Atlas Activity Feed regularly
   - Set up alerts for unusual activity

4. **Backup Your Data**
   - Enable automated backups in Atlas (paid tier)
   - Or export data regularly: `mongodump --uri="mongodb+srv://..."`

5. **Restrict IP Access (Optional)**
   - After deploying to Render, you can find Render's IP ranges
   - Replace 0.0.0.0/0 with specific IPs for better security
   - Note: This requires paid Render plan for static IPs

## Connection String Variations

### For Different Environments:

**Development (Local):**
```
MONGODB_URI=mongodb://localhost:27017/phish_detector
```

**Production (MongoDB Atlas - Render):**
```
MONGODB_URI=mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector?retryWrites=true&w=majority
```

## Troubleshooting

### Error: "Authentication failed"
- Verify username and password are correct
- Check if user exists in Database Access
- Ensure user has proper permissions

### Error: "Connection timeout"
- Check Network Access whitelist includes 0.0.0.0/0
- Verify cluster is active (not paused)
- Check firewall settings

### Error: "Too many connections"
- Free tier M0 has limit of 500 concurrent connections
- Monitor connection pool in Atlas dashboard
- Consider upgrading cluster tier

### Error: "Database not found"
- Database will be created automatically on first write
- Verify connection string includes database name
- Check collection names in your models

## Monitoring

### Atlas Dashboard Metrics:
- **Connections:** Monitor active connections
- **Operations:** Track read/write operations
- **Storage:** Check database size
- **Network:** Monitor data transfer

### Set Up Alerts:
1. Go to Atlas Dashboard → Alerts
2. Create alerts for:
   - High connection count
   - Storage reaching limit
   - Unusual activity patterns

## Backup Strategy

### Manual Backup (Free Tier):
```bash
# Export database
mongodump --uri="mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector" --out=./backup

# Restore database
mongorestore --uri="mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector" ./backup
```

### Automated Backup (Paid Tier):
- Available on M10+ clusters
- Configure in Atlas: Backup tab → Configure Cloud Backup

## Useful MongoDB Atlas Links

- **Dashboard:** https://cloud.mongodb.com/
- **Documentation:** https://docs.atlas.mongodb.com/
- **Connection Guide:** https://docs.atlas.mongodb.com/connect-to-cluster/
- **Security Checklist:** https://docs.atlas.mongodb.com/security-checklist/

---

**Next Steps:**
1. ✅ Ensure Network Access is configured (0.0.0.0/0)
2. ✅ Verify user permissions
3. ✅ Test connection locally (optional)
4. 🚀 Proceed with Render deployment (see DEPLOYMENT_CHECKLIST.md)

**Need Help?**
- MongoDB Atlas Support: https://support.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/
