// Bebsy Referral System Backend API - Enhanced Version
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const csv = require('csv-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enhanced Database connection with connection pooling
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bebsy_referral_system',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

// Enhanced middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced rate limiting
const createLimiter = (windowMs, max) => rateLimit({
  windowMs,
  max,
  message: { error: 'Te veel verzoeken, probeer later opnieuw' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', createLimiter(15 * 60 * 1000, 5)); // 5 login attempts per 15 minutes
app.use('/api', createLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Enhanced file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Alleen CSV bestanden zijn toegestaan'));
    }
  }
});

// JWT Secret validation
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long');
  process.exit(1);
}

// Enhanced utility functions
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateUniqueReferralCode = async () => {
  let code;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 100;
  
  while (exists && attempts < maxAttempts) {
    code = generateReferralCode();
    try {
      const result = await pool.query('SELECT id FROM customers WHERE referral_code = $1', [code]);
      exists = result.rows.length > 0;
      attempts++;
    } catch (error) {
      throw new Error('Database error during code generation');
    }
  }
  
  if (attempts >= maxAttempts) {
    throw new Error('Could not generate unique referral code');
  }
  
  return code;
};

// Enhanced error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Enhanced auth middleware
const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Toegangstoken vereist' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists and is active
    const userResult = await pool.query(
      'SELECT id, username, role, is_active FROM admin_users WHERE id = $1 AND is_active = true',
      [user.id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: 'Gebruiker niet gevonden of gedeactiveerd' });
    }
    
    req.user = userResult.rows[0];
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Ongeldig token' });
  }
});

// Enhanced validation schemas
const customerSchema = Joi.object({
  bebsy_customer_id: Joi.string().trim().min(1).max(50).required(),
  name: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().email().max(255).required()
});

const referralSchema = Joi.object({
  referrer_code: Joi.string().length(8).required(),
  new_customer_email: Joi.string().email().required(),
  booking_reference: Joi.string().max(100).optional().allow('')
});

const rewardSchema = Joi.object({
  customer_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().precision(2).required(),
  type: Joi.string().valid('credit', 'cash').required(),
  description: Joi.string().max(500).optional().allow('')
});

// Enhanced routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Authentication
app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Gebruikersnaam en wachtwoord zijn vereist' });
  }
  
  const result = await pool.query(
    'SELECT * FROM admin_users WHERE username = $1 AND is_active = true',
    [username]
  );
  
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Ongeldige inloggegevens' });
  }
  
  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!validPassword) {
    return res.status(401).json({ error: 'Ongeldige inloggegevens' });
  }
  
  // Update last login
  await pool.query(
    'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [user.id]
  );
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
  
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
}));

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Enhanced customer management
app.get('/api/customers', authenticateToken, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
  const offset = (page - 1) * limit;
  
  // Validate sort parameters
  const allowedSortFields = ['name', 'email', 'created_at', 'referral_count', 'total_rewards'];
  const allowedSortOrders = ['ASC', 'DESC'];
  
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const order = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
  
  let baseQuery = `
    SELECT c.*, 
      COUNT(r.id) as referral_count,
      COALESCE(SUM(CASE WHEN rw.status = 'paid' THEN rw.amount ELSE 0 END), 0) as total_rewards
    FROM customers c
    LEFT JOIN referrals r ON c.id = r.referrer_id
    LEFT JOIN rewards rw ON c.id = rw.customer_id
  `;
  
  let whereClause = '';
  let params = [];
  
  if (search) {
    whereClause = ' WHERE (c.name ILIKE $1 OR c.email ILIKE $1 OR c.referral_code ILIKE $1 OR c.bebsy_customer_id ILIKE $1)';
    params.push(`%${search}%`);
  }
  
  const groupClause = ' GROUP BY c.id';
  const orderClause = ` ORDER BY ${sortField === 'referral_count' || sortField === 'total_rewards' ? sortField : 'c.' + sortField} ${order}`;
  const limitClause = ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  
  const query = baseQuery + whereClause + groupClause + orderClause + limitClause;
  params.push(parseInt(limit), parseInt(offset));
  
  const result = await pool.query(query, params);
  
  // Get total count
  let countQuery = 'SELECT COUNT(*) FROM customers c';
  let countParams = [];
  if (search) {
    countQuery += ' WHERE (name ILIKE $1 OR email ILIKE $1 OR referral_code ILIKE $1 OR bebsy_customer_id ILIKE $1)';
    countParams.push(`%${search}%`);
  }
  
  const countResult = await pool.query(countQuery, countParams);
  const total = parseInt(countResult.rows[0].count);
  
  res.json({
    customers: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

app.get('/api/customers/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query(`
    SELECT c.*, 
      COUNT(r.id) as referral_count,
      COALESCE(SUM(CASE WHEN rw.status = 'paid' THEN rw.amount ELSE 0 END), 0) as total_rewards
    FROM customers c
    LEFT JOIN referrals r ON c.id = r.referrer_id
    LEFT JOIN rewards rw ON c.id = rw.customer_id
    WHERE c.id = $1
    GROUP BY c.id
  `, [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Klant niet gevonden' });
  }
  
  res.json(result.rows[0]);
}));

app.post('/api/customers', authenticateToken, asyncHandler(async (req, res) => {
  const { error, value } = customerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { bebsy_customer_id, name, email } = value;
  const referral_code = await generateUniqueReferralCode();
  
  const result = await pool.query(
    'INSERT INTO customers (bebsy_customer_id, name, email, referral_code) VALUES ($1, $2, $3, $4) RETURNING *',
    [bebsy_customer_id, name, email, referral_code]
  );
  
  res.status(201).json(result.rows[0]);
}));

app.put('/api/customers/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = customerSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { bebsy_customer_id, name, email } = value;
  
  const result = await pool.query(
    'UPDATE customers SET bebsy_customer_id = $1, name = $2, email = $3 WHERE id = $4 RETURNING *',
    [bebsy_customer_id, name, email, id]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Klant niet gevonden' });
  }
  
  res.json(result.rows[0]);
}));

app.delete('/api/customers/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING id', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Klant niet gevonden' });
  }
  
  res.json({ message: 'Klant succesvol verwijderd' });
}));

// Enhanced CSV Import
app.post('/api/customers/import', authenticateToken, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Geen bestand geüpload' });
  }
  
  const results = [];
  const errors = [];
  let rowNumber = 0;
  
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          rowNumber++;
          
          // Clean and validate row data
          const cleanData = {
            bebsy_customer_id: data.bebsy_customer_id?.toString().trim(),
            name: data.name?.toString().trim(),
            email: data.email?.toString().trim().toLowerCase()
          };
          
          const { error, value } = customerSchema.validate(cleanData);
          
          if (error) {
            errors.push({ 
              row: rowNumber, 
              error: error.details[0].message, 
              data: cleanData 
            });
          } else {
            results.push(value);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validatiefouten gevonden', 
        errors: errors.slice(0, 10),
        totalErrors: errors.length,
        totalRows: rowNumber
      });
    }
    
    let imported = 0;
    let skipped = 0;
    const importErrors = [];
    
    // Import customers in batches
    const batchSize = 100;
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      
      for (const customer of batch) {
        try {
          const referral_code = await generateUniqueReferralCode();
          await pool.query(
            'INSERT INTO customers (bebsy_customer_id, name, email, referral_code) VALUES ($1, $2, $3, $4)',
            [customer.bebsy_customer_id, customer.name, customer.email, referral_code]
          );
          imported++;
        } catch (error) {
          if (error.code === '23505') {
            skipped++;
          } else {
            importErrors.push({ 
              customer: customer.email, 
              error: error.message 
            });
          }
        }
      }
    }
    
    res.json({
      message: 'Import voltooid',
      imported,
      skipped,
      errors: importErrors.slice(0, 5),
      totalProcessed: results.length
    });
    
  } catch (error) {
    // Clean up uploaded file on error
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
}));

// Enhanced referral management
app.get('/api/referrals', authenticateToken, asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    status = '', 
    sortBy = 'created_at', 
    sortOrder = 'DESC',
    dateFrom = '',
    dateTo = ''
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT r.*, 
      c.name as referrer_name, 
      c.email as referrer_email, 
      c.referral_code,
      rw.amount as reward_amount,
      rw.type as reward_type,
      rw.status as reward_status
    FROM referrals r
    JOIN customers c ON r.referrer_id = c.id
    LEFT JOIN rewards rw ON r.id = rw.referral_id
  `;
  
  let conditions = [];
  let params = [];
  let paramIndex = 1;
  
  if (status) {
    conditions.push(`r.reward_status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }
  
  if (dateFrom) {
    conditions.push(`r.created_at >= $${paramIndex}`);
    params.push(dateFrom);
    paramIndex++;
  }
  
  if (dateTo) {
    conditions.push(`r.created_at <= $${paramIndex}`);
    params.push(dateTo + ' 23:59:59');
    paramIndex++;
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ` ORDER BY r.${sortBy} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(parseInt(limit), parseInt(offset));
  
  const result = await pool.query(query, params);
  
  // Get total count
  let countQuery = `
    SELECT COUNT(*) 
    FROM referrals r 
    JOIN customers c ON r.referrer_id = c.id
  `;
  
  if (conditions.length > 0) {
    countQuery += ' WHERE ' + conditions.join(' AND ');
  }
  
  const countResult = await pool.query(countQuery, params.slice(0, -2));
  const total = parseInt(countResult.rows[0].count);
  
  res.json({
    referrals: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

app.get('/api/referrals/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query(`
    SELECT r.*, 
      c.name as referrer_name, 
      c.email as referrer_email, 
      c.referral_code
    FROM referrals r
    JOIN customers c ON r.referrer_id = c.id
    WHERE r.id = $1
  `, [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Referral niet gevonden' });
  }
  
  res.json(result.rows[0]);
}));

app.post('/api/referrals', asyncHandler(async (req, res) => {
  const { error, value } = referralSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { referrer_code, new_customer_email, booking_reference } = value;
  
  // Find referrer
  const referrerResult = await pool.query(
    'SELECT id, name FROM customers WHERE referral_code = $1',
    [referrer_code]
  );
  
  if (referrerResult.rows.length === 0) {
    return res.status(404).json({ error: 'Ongeldige referral code' });
  }
  
  const referrer_id = referrerResult.rows[0].id;
  
  // Check if referral already exists
  const existingReferral = await pool.query(
    'SELECT id FROM referrals WHERE referrer_id = $1 AND new_customer_email = $2',
    [referrer_id, new_customer_email]
  );
  
  if (existingReferral.rows.length > 0) {
    return res.status(400).json({ error: 'Deze referral bestaat al' });
  }
  
  const result = await pool.query(
    'INSERT INTO referrals (referrer_id, new_customer_email, booking_reference) VALUES ($1, $2, $3) RETURNING *',
    [referrer_id, new_customer_email, booking_reference]
  );
  
  res.status(201).json({
    ...result.rows[0],
    referrer_name: referrerResult.rows[0].name
  });
}));

app.put('/api/referrals/:id/status', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['pending', 'approved', 'paid', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Ongeldige status' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const referralResult = await client.query(
      'UPDATE referrals SET reward_status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (referralResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Referral niet gevonden' });
    }
    
    const referral = referralResult.rows[0];
    
    // Create reward when referral is approved
    if (status === 'approved') {
      const rewardAmount = parseFloat(process.env.DEFAULT_REWARD_AMOUNT || '25.00');
      
      await client.query(
        'INSERT INTO rewards (customer_id, referral_id, amount, type, status, description) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          referral.referrer_id,
          referral.id,
          rewardAmount,
          'credit',
          'approved',
          `Beloning voor referral: ${referral.new_customer_email}`
        ]
      );
    }
    
    await client.query('COMMIT');
    
    res.json(referral);
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

// Enhanced rewards management
app.get('/api/rewards', authenticateToken, asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    status = '', 
    type = '',
    customerId = ''
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT rw.*, 
      c.name as customer_name, 
      c.email as customer_email,
      c.referral_code,
      r.new_customer_email
    FROM rewards rw
    JOIN customers c ON rw.customer_id = c.id
    LEFT JOIN referrals r ON rw.referral_id = r.id
  `;
  
  let conditions = [];
  let params = [];
  let paramIndex = 1;
  
  if (status) {
    conditions.push(`rw.status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }
  
  if (type) {
    conditions.push(`rw.type = $${paramIndex}`);
    params.push(type);
    paramIndex++;
  }
  
  if (customerId) {
    conditions.push(`rw.customer_id = $${paramIndex}`);
    params.push(customerId);
    paramIndex++;
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ` ORDER BY rw.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(parseInt(limit), parseInt(offset));
  
  const result = await pool.query(query, params);
  
  res.json({ rewards: result.rows });
}));

app.post('/api/rewards', authenticateToken, asyncHandler(async (req, res) => {
  const { error, value } = rewardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { customer_id, amount, type, description } = value;
  
  // Verify customer exists
  const customerResult = await pool.query('SELECT id FROM customers WHERE id = $1', [customer_id]);
  if (customerResult.rows.length === 0) {
    return res.status(404).json({ error: 'Klant niet gevonden' });
  }
  
  const result = await pool.query(
    'INSERT INTO rewards (customer_id, amount, type, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [customer_id, amount, type, description, 'pending']
  );
  
  res.status(201).json(result.rows[0]);
}));

app.put('/api/rewards/:id/status', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['pending', 'approved', 'paid', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Ongeldige status' });
  }
  
  const result = await pool.query(
    'UPDATE rewards SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Beloning niet gevonden' });
  }
  
  res.json(result.rows[0]);
}));

// Enhanced dashboard statistics
app.get('/api/dashboard/stats', authenticateToken, asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // days
  
  const stats = await Promise.all([
    // Total customers
    pool.query('SELECT COUNT(*) as total_customers FROM customers'),
    
    // Total referrals
    pool.query('SELECT COUNT(*) as total_referrals FROM referrals'),
    
    // Pending referrals
    pool.query('SELECT COUNT(*) as pending_referrals FROM referrals WHERE reward_status = \'pending\''),
    
    // Total rewards paid
    pool.query('SELECT COALESCE(SUM(amount), 0) as total_rewards FROM rewards WHERE status = \'paid\''),
    
    // Referral trend
    pool.query(`
      SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count
      FROM referrals 
      WHERE created_at >= CURRENT_DATE - INTERVAL '${parseInt(period)} days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `),
    
    // Top referrers
    pool.query(`
      SELECT c.name, c.email, c.referral_code, COUNT(r.id) as referral_count
      FROM customers c
      JOIN referrals r ON c.id = r.referrer_id
      WHERE r.created_at >= CURRENT_DATE - INTERVAL '${parseInt(period)} days'
      GROUP BY c.id, c.name, c.email, c.referral_code
      ORDER BY referral_count DESC
      LIMIT 5
    `),
    
    // Reward statistics
    pool.query(`
      SELECT 
        type,
        status,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM rewards
      WHERE created_at >= CURRENT_DATE - INTERVAL '${parseInt(period)} days'
      GROUP BY type, status
    `)
  ]);
  
  res.json({
    totalCustomers: parseInt(stats[0].rows[0].total_customers),
    totalReferrals: parseInt(stats[1].rows[0].total_referrals),
    pendingReferrals: parseInt(stats[2].rows[0].pending_referrals),
    totalRewards: parseFloat(stats[3].rows[0].total_rewards),
    referralTrend: stats[4].rows,
    topReferrers: stats[5].rows,
    rewardStats: stats[6].rows
  });
}));

// Referral code lookup
app.get('/api/referrals/lookup/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  
  const result = await pool.query(
    'SELECT id, name, email, referral_code FROM customers WHERE referral_code = $1',
    [code.toUpperCase()]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Referral code niet gevonden' });
  }
  
  res.json(result.rows[0]);
}));

// Export functionality
app.get('/api/export/:type', authenticateToken, asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { format = 'json' } = req.query;
  
  let query = '';
  let filename = '';
  
  switch (type) {
    case 'customers':
      query = `
        SELECT 
          c.bebsy_customer_id,
          c.name,
          c.email,
          c.referral_code,
          c.created_at,
          COUNT(r.id) as referral_count,
          COALESCE(SUM(CASE WHEN rw.status = 'paid' THEN rw.amount ELSE 0 END), 0) as total_rewards_paid
        FROM customers c
        LEFT JOIN referrals r ON c.id = r.referrer_id
        LEFT JOIN rewards rw ON c.id = rw.customer_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `;
      filename = 'klanten-export';
      break;
      
    case 'referrals':
      query = `
        SELECT 
          r.new_customer_email,
          r.booking_reference,
          r.reward_status,
          r.created_at,
          c.name as referrer_name,
          c.email as referrer_email,
          c.referral_code
        FROM referrals r
        JOIN customers c ON r.referrer_id = c.id
        ORDER BY r.created_at DESC
      `;
      filename = 'referrals-export';
      break;
      
    case 'rewards':
      query = `
        SELECT 
          rw.amount,
          rw.type,
          rw.status,
          rw.description,
          rw.created_at,
          c.name as customer_name,
          c.email as customer_email,
          c.referral_code
        FROM rewards rw
        JOIN customers c ON rw.customer_id = c.id
        ORDER BY rw.created_at DESC
      `;
      filename = 'beloningen-export';
      break;
      
    default:
      return res.status(400).json({ error: 'Ongeldig export type' });
  }
  
  const result = await pool.query(query);
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (format === 'csv') {
    // Convert to CSV
    const headers = Object.keys(result.rows[0] || {});
    const csvContent = [
      headers.join(','),
      ...result.rows.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-${timestamp}.csv`);
    res.send(csvContent);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-${timestamp}.json`);
    res.json(result.rows);
  }
}));

// Bulk operations
app.post('/api/referrals/bulk-update', authenticateToken, asyncHandler(async (req, res) => {
  const { referralIds, status } = req.body;
  
  if (!Array.isArray(referralIds) || referralIds.length === 0) {
    return res.status(400).json({ error: 'Geen referral IDs opgegeven' });
  }
  
  if (!['pending', 'approved', 'paid', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Ongeldige status' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      'UPDATE referrals SET reward_status = $1 WHERE id = ANY($2) RETURNING id, referrer_id',
      [status, referralIds]
    );
    
    // Create rewards for approved referrals
    if (status === 'approved') {
      const rewardAmount = parseFloat(process.env.DEFAULT_REWARD_AMOUNT || '25.00');
      
      for (const referral of result.rows) {
        await client.query(
          'INSERT INTO rewards (customer_id, referral_id, amount, type, status, description) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            referral.referrer_id,
            referral.id,
            rewardAmount,
            'credit',
            'approved',
            'Bulk goedgekeurde referral beloning'
          ]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.json({ 
      message: `${result.rows.length} referrals bijgewerkt naar status: ${status}`,
      updated: result.rows.length 
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

// Analytics endpoints
app.get('/api/analytics/conversion-rate', authenticateToken, asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  
  const result = await pool.query(`
    WITH referral_stats AS (
      SELECT 
        DATE_TRUNC('week', created_at) as week,
        COUNT(*) as total_referrals,
        COUNT(CASE WHEN reward_status = 'approved' OR reward_status = 'paid' THEN 1 END) as converted_referrals
      FROM referrals
      WHERE created_at >= CURRENT_DATE - INTERVAL '${parseInt(period)} days'
      GROUP BY DATE_TRUNC('week', created_at)
    )
    SELECT 
      week,
      total_referrals,
      converted_referrals,
      CASE 
        WHEN total_referrals > 0 THEN ROUND((converted_referrals::decimal / total_referrals) * 100, 2)
        ELSE 0 
      END as conversion_rate
    FROM referral_stats
    ORDER BY week
  `);
  
  res.json(result.rows);
}));

app.get('/api/analytics/revenue-impact', authenticateToken, asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', r.created_at) as month,
      COUNT(r.id) as referrals_count,
      COALESCE(SUM(rw.amount), 0) as total_rewards,
      -- Assuming average booking value
      COUNT(r.id) * ${parseFloat(process.env.AVERAGE_BOOKING_VALUE || '500')} as estimated_revenue
    FROM referrals r
    LEFT JOIN rewards rw ON r.id = rw.referral_id AND rw.status = 'paid'
    WHERE r.created_at >= CURRENT_DATE - INTERVAL '${parseInt(period)} days'
      AND r.reward_status IN ('approved', 'paid')
    GROUP BY DATE_TRUNC('month', r.created_at)
    ORDER BY month
  `);
  
  res.json(result.rows);
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Database errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        return res.status(400).json({ error: 'Deze gegevens bestaan al in het systeem' });
      case '23503': // Foreign key violation
        return res.status(400).json({ error: 'Verwijzing naar niet-bestaande gegevens' });
      case '23514': // Check violation
        return res.status(400).json({ error: 'Ongeldige waarde opgegeven' });
      default:
        return res.status(500).json({ error: 'Database fout opgetreden' });
    }
  }
  
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Bestand is te groot (max 5MB)' });
    }
    return res.status(400).json({ error: 'Bestand upload fout' });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Ongeldig token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token verlopen' });
  }
  
  // Default error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Er is een serverfout opgetreden' 
      : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint niet gevonden' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`✅ Bebsy Referral System API running on port ${port}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
  