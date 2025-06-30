# Panduan Troubleshooting: Infinite Loop Login

## 1. ANALISIS TEKNIS DETAIL

### A. Status Cookies dan Session di Browser

#### Pemeriksaan Cookies:
```javascript
// Buka Developer Tools > Console dan jalankan:
console.log('All cookies:', document.cookie);

// Periksa cookies spesifik auth:
const authCookies = document.cookie
  .split(';')
  .filter(cookie => cookie.includes('auth') || cookie.includes('session'));
console.log('Auth cookies:', authCookies);

// Periksa localStorage auth data:
console.log('Auth user:', localStorage.getItem('auth_user'));
console.log('Auth token:', localStorage.getItem('auth_token'));
console.log('Session expiry:', localStorage.getItem('session_expiry'));
```

#### Masalah Umum Cookies:
- **SameSite Policy**: Cookie tidak dikirim karena kebijakan SameSite
- **Secure Flag**: Cookie hanya dikirim melalui HTTPS
- **Domain Mismatch**: Cookie domain tidak cocok dengan current domain
- **Expired Cookies**: Session sudah expired tapi tidak dibersihkan

### B. Konfigurasi Keamanan Browser

#### Content Security Policy (CSP):
```javascript
// Periksa CSP headers di Network tab
fetch(window.location.href)
  .then(response => {
    console.log('CSP Header:', response.headers.get('Content-Security-Policy'));
  });
```

#### CORS Issues:
```javascript
// Periksa CORS di Network tab untuk request authentication
// Look for preflight OPTIONS requests yang gagal
```

#### Browser Security Settings:
- **Third-party cookies blocked**
- **JavaScript disabled**
- **Local storage disabled**
- **Incognito mode restrictions**

### C. Log Error di Browser Console

#### Monitoring Console Errors:
```javascript
// Tambahkan error listener global
window.addEventListener('error', function(e) {
  console.error('Global error:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    error: e.error
  });
});

// Monitor unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});
```

#### React Error Boundaries:
```javascript
// Tambahkan error boundary untuk menangkap React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
```

### D. Status Server dan Response Code

#### Network Monitoring:
```javascript
// Monitor semua network requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch request:', args[0], args[1]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Fetch response:', {
        url: args[0],
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      return response;
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};
```

#### Server Response Analysis:
- **Status Code 200**: Success tapi redirect loop
- **Status Code 302/301**: Redirect chains
- **Status Code 401**: Unauthorized loops
- **Status Code 500**: Server errors

### E. Cross-Site Scripting Issues

#### XSS Detection:
```javascript
// Periksa apakah ada script injection
const suspiciousPatterns = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /eval\(/i
];

const checkXSS = (str) => {
  return suspiciousPatterns.some(pattern => pattern.test(str));
};

// Periksa localStorage dan sessionStorage
Object.keys(localStorage).forEach(key => {
  const value = localStorage.getItem(key);
  if (checkXSS(value)) {
    console.warn('Potential XSS in localStorage:', key, value);
  }
});
```

### F. Cache Browser

#### Cache Analysis:
```javascript
// Periksa cache status
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    console.log('Available caches:', cacheNames);
    cacheNames.forEach(cacheName => {
      caches.open(cacheName).then(cache => {
        cache.keys().then(requests => {
          console.log(`Cache ${cacheName}:`, requests.map(req => req.url));
        });
      });
    });
  });
}
```

## 2. PANDUAN TROUBLESHOOTING SISTEMATIS

### A. Langkah Verifikasi dari Sisi Client

#### Step 1: Clear Browser Data
```bash
# Chrome DevTools > Application > Storage > Clear storage
# Atau manual:
localStorage.clear();
sessionStorage.clear();
// Clear cookies manually di DevTools > Application > Cookies
```

#### Step 2: Disable Browser Extensions
```javascript
// Test di Incognito mode atau disable semua extensions
// Jalankan test login tanpa extensions
```

#### Step 3: Check Network Connectivity
```javascript
// Test network connectivity
navigator.onLine ? console.log('Online') : console.log('Offline');

// Test specific endpoint
fetch('/api/health')
  .then(response => console.log('Server reachable:', response.status))
  .catch(error => console.error('Server unreachable:', error));
```

#### Step 4: Validate Form Data
```javascript
// Tambahkan logging di form submission
const loginForm = document.querySelector('form');
loginForm.addEventListener('submit', function(e) {
  const formData = new FormData(e.target);
  console.log('Form submission data:', Object.fromEntries(formData));
});
```

### B. Langkah Verifikasi dari Sisi Server

#### Step 1: Server Logs Analysis
```bash
# Check server logs untuk authentication requests
tail -f /var/log/nginx/access.log | grep -i auth
tail -f /var/log/application.log | grep -i login

# Look for patterns:
# - Multiple rapid requests dari same IP
# - 302 redirect loops
# - Session creation/destruction cycles
```

#### Step 2: Database Session Check
```sql
-- Check active sessions di database
SELECT * FROM sessions WHERE user_id = 'target_user_id';

-- Check session expiry
SELECT *, 
       CASE WHEN expires_at < NOW() THEN 'EXPIRED' ELSE 'ACTIVE' END as status
FROM sessions 
WHERE user_id = 'target_user_id';
```

#### Step 3: Authentication Flow Validation
```javascript
// Server-side logging untuk auth flow
app.post('/login', (req, res) => {
  console.log('Login attempt:', {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body
  });
  
  // Validate credentials
  // Create session
  // Send response
  
  console.log('Login response:', {
    success: true,
    redirectTo: '/dashboard',
    sessionId: req.session.id
  });
});
```

### C. Tools Diagnostik yang Direkomendasikan

#### Browser Developer Tools:
1. **Network Tab**: Monitor semua HTTP requests
2. **Console Tab**: Check JavaScript errors
3. **Application Tab**: Inspect localStorage, sessionStorage, cookies
4. **Security Tab**: Check certificate dan security issues

#### External Tools:
```bash
# cURL untuk test authentication endpoint
curl -v -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  https://yoursite.com/api/login

# Postman untuk comprehensive API testing
# Burp Suite untuk security testing
# Chrome Lighthouse untuk performance analysis
```

#### Custom Debugging Tools:
```javascript
// Custom debug logger
const debugLogger = {
  log: (category, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${category}]`, data);
    
    // Send to server untuk centralized logging
    fetch('/api/debug-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, category, data })
    });
  }
};

// Usage
debugLogger.log('AUTH', 'Login attempt started');
debugLogger.log('AUTH', 'Credentials validated');
debugLogger.log('AUTH', 'Session created');
```

### D. Cara Mengumpulkan Log yang Relevan

#### Client-Side Logging:
```javascript
// Comprehensive client logging
const clientLogger = {
  events: [],
  
  log(event, data) {
    const logEntry = {
      timestamp: Date.now(),
      event,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.events.push(logEntry);
    console.log('Client Log:', logEntry);
    
    // Auto-send logs when buffer is full
    if (this.events.length >= 50) {
      this.sendLogs();
    }
  },
  
  sendLogs() {
    fetch('/api/client-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.events)
    });
    this.events = [];
  }
};

// Track authentication events
clientLogger.log('AUTH_START', { email: 'user@example.com' });
clientLogger.log('AUTH_RESPONSE', { status: 200, redirectTo: '/dashboard' });
clientLogger.log('REDIRECT_ATTEMPT', { from: '/login', to: '/dashboard' });
```

#### Server-Side Logging:
```javascript
// Express middleware untuk comprehensive logging
const authLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  console.log('Auth Request:', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    sessionId: req.session?.id,
    timestamp: new Date().toISOString()
  });
  
  // Override res.redirect untuk log redirects
  const originalRedirect = res.redirect;
  res.redirect = function(url) {
    console.log('Auth Redirect:', {
      from: req.url,
      to: url,
      sessionId: req.session?.id,
      duration: Date.now() - startTime
    });
    originalRedirect.call(this, url);
  };
  
  next();
};
```

## 3. SOLUSI KONKRET

### A. Masalah Cookies/Session

#### Solusi 1: Fix Cookie Configuration
```javascript
// Client-side: Proper cookie handling
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
};

// Server-side: Express session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // CSRF protection
  },
  store: new RedisStore({ client: redisClient }) // Use persistent store
}));
```

#### Solusi 2: Session Validation
```javascript
// Middleware untuk validate session
const validateSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'No valid session' });
  }
  
  // Check session expiry
  if (req.session.expiresAt && new Date() > new Date(req.session.expiresAt)) {
    req.session.destroy();
    return res.status(401).json({ error: 'Session expired' });
  }
  
  next();
};
```

### B. Masalah Cache

#### Solusi 1: Cache Headers
```javascript
// Server-side: Proper cache headers untuk auth endpoints
app.use('/api/auth', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});
```

#### Solusi 2: Client-side Cache Busting
```javascript
// Add timestamp untuk prevent caching
const authRequest = (url, options = {}) => {
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  const urlWithTimestamp = `${url}${separator}_t=${timestamp}`;
  
  return fetch(urlWithTimestamp, {
    ...options,
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...options.headers
    }
  });
};
```

### C. Masalah Konfigurasi Keamanan

#### Solusi 1: CORS Configuration
```javascript
// Server-side: Proper CORS setup
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### Solusi 2: CSP Headers
```javascript
// Content Security Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "connect-src 'self' " + process.env.API_URL
  );
  next();
});
```

### D. Masalah Coding

#### Solusi 1: Fix Redirect Loop di React
```javascript
// AuthContext fix untuk prevent infinite redirects
const AuthProvider = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsChecking(false);
          return;
        }
        
        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Prevent rendering until auth check is complete
  if (isChecking) {
    return <div>Loading...</div>;
  }
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Solusi 2: Protected Route Fix
```javascript
// ProtectedRoute component yang proper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Insufficient permissions
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
```

### E. Masalah Server

#### Solusi 1: Rate Limiting
```javascript
// Implement rate limiting untuk prevent abuse
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // Login logic
});
```

#### Solusi 2: Database Connection Pooling
```javascript
// Proper database connection management
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Use pool untuk database queries
const authenticateUser = async (email, password) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};
```

## 4. MONITORING DAN PREVENTION

### Real-time Monitoring:
```javascript
// Setup monitoring untuk detect infinite loops
const loopDetector = {
  requests: new Map(),
  
  track(url, userId) {
    const key = `${url}-${userId}`;
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests (older than 1 minute)
    const recentRequests = requests.filter(time => now - time < 60000);
    recentRequests.push(now);
    
    this.requests.set(key, recentRequests);
    
    // Alert if more than 10 requests in 1 minute
    if (recentRequests.length > 10) {
      console.error('Potential infinite loop detected:', { url, userId, count: recentRequests.length });
      // Send alert to monitoring system
    }
  }
};
```

### Health Checks:
```javascript
// Endpoint untuk health monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    activeConnections: req.socket.server._connections
  });
});
```

Implementasikan solusi-solusi ini secara bertahap dan monitor hasilnya. Mulai dengan clearing browser data dan checking console errors, kemudian lanjut ke server-side fixes jika diperlukan.