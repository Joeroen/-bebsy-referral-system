-- Bebsy Referral System Database Initialization Script
-- Run this script to set up the complete database structure

-- Create database and user (run as postgres superuser)
-- CREATE DATABASE bebsy_referral_system;
-- CREATE USER bebsy_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE bebsy_referral_system TO bebsy_user;
-- \c bebsy_referral_system;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set timezone
SET timezone = 'Europe/Amsterdam';

-- Drop existing tables if they exist (for fresh install)
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create custom types
CREATE TYPE reward_type AS ENUM ('credit', 'cash');
CREATE TYPE reward_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'viewer');

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bebsy_customer_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    referral_code VARCHAR(8) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(2) DEFAULT 'NL',
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_referral_code CHECK (referral_code ~ '^[A-Z0-9]{8}$'),
    CONSTRAINT valid_country CHECK (country ~ '^[A-Z]{2}$')
);

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    new_customer_email VARCHAR(255) NOT NULL,
    new_customer_name VARCHAR(255),
    booking_reference VARCHAR(100),
    booking_value DECIMAL(10,2),
    booking_date DATE,
    reward_status reward_status DEFAULT 'pending',
    notes TEXT,
    processed_by UUID REFERENCES admin_users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_new_customer_email CHECK (new_customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_booking_value CHECK (booking_value IS NULL OR booking_value > 0)
);

-- Rewards table
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    type reward_type NOT NULL,
    status reward_status DEFAULT 'pending',
    description TEXT,
    payment_reference VARCHAR(100),
    payment_method VARCHAR(50),
    processed_by UUID REFERENCES admin_users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table for tracking changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES admin_users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Settings table for system configuration
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recipient_id UUID REFERENCES admin_users(id),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_referral_code ON customers(referral_code);
CREATE INDEX idx_customers_bebsy_id ON customers(bebsy_customer_id);
CREATE INDEX idx_customers_active ON customers(is_active);
CREATE INDEX idx_customers_created_at ON customers(created_at);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(reward_status);
CREATE INDEX idx_referrals_email ON referrals(new_customer_email);
CREATE INDEX idx_referrals_created_at ON referrals(created_at);
CREATE INDEX idx_referrals_booking_ref ON referrals(booking_reference);

CREATE INDEX idx_rewards_customer_id ON rewards(customer_id);
CREATE INDEX idx_rewards_referral_id ON rewards(referral_id);
CREATE INDEX idx_rewards_status ON rewards(status);
CREATE INDEX idx_rewards_type ON rewards(type);
CREATE INDEX idx_rewards_created_at ON rewards(created_at);

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at 
    BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at 
    BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit triggers
CREATE TRIGGER customers_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER referrals_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON referrals
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER rewards_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON rewards
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create views for reporting and statistics
CREATE VIEW referral_stats AS
SELECT 
    c.id,
    c.bebsy_customer_id,
    c.name,
    c.email,
    c.referral_code,
    c.created_at,
    COUNT(r.id) as total_referrals,
    COUNT(CASE WHEN r.reward_status = 'approved' THEN 1 END) as approved_referrals,
    COUNT(CASE WHEN r.reward_status = 'paid' THEN 1 END) as paid_referrals,
    COALESCE(SUM(CASE WHEN rw.status = 'approved' THEN rw.amount ELSE 0 END), 0) as approved_rewards,
    COALESCE(SUM(CASE WHEN rw.status = 'paid' THEN rw.amount ELSE 0 END), 0) as paid_rewards,
    MAX(r.created_at) as last_referral_date
FROM customers c
LEFT JOIN referrals r ON c.id = r.referrer_id
LEFT JOIN rewards rw ON c.id = rw.customer_id
GROUP BY c.id, c.bebsy_customer_id, c.name, c.email, c.referral_code, c.created_at;

-- Create view for dashboard metrics
CREATE VIEW dashboard_metrics AS
SELECT
    (SELECT COUNT(*) FROM customers WHERE is_active = true) as active_customers,
    (SELECT COUNT(*) FROM referrals) as total_referrals,
    (SELECT COUNT(*) FROM referrals WHERE reward_status = 'pending') as pending_referrals,
    (SELECT COUNT(*) FROM referrals WHERE reward_status = 'approved') as approved_referrals,
    (SELECT COUNT(*) FROM referrals WHERE reward_status = 'paid') as paid_referrals,
    (SELECT COALESCE(SUM(amount), 0) FROM rewards WHERE status = 'paid') as total_rewards_paid,
    (SELECT COALESCE(SUM(amount), 0) FROM rewards WHERE status = 'approved') as total_rewards_approved,
    (SELECT COALESCE(AVG(amount), 0) FROM rewards WHERE status = 'paid') as average_reward_amount;

-- Create view for monthly statistics
CREATE VIEW monthly_stats AS
SELECT
    DATE_TRUNC('month', created_at) as month,
    'referrals' as metric_type,
    COUNT(*) as count,
    0 as amount
FROM referrals
GROUP BY DATE_TRUNC('month', created_at)
UNION ALL
SELECT
    DATE_TRUNC('month', created_at) as month,
    'rewards_paid' as metric_type,
    COUNT(*) as count,
    COALESCE(SUM(amount), 0) as amount
FROM rewards
WHERE status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Insert default admin user (password: 'admin123' - CHANGE IN PRODUCTION!)
INSERT INTO admin_users (username, password_hash, email, role) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@bebsy.nl', 'admin');

-- Insert system settings with default values
INSERT INTO system_settings (key, value, description) VALUES
('default_reward_amount', '25.00', 'Standaard beloning voor referrals in euro'),
('reward_expiry_days', '365', 'Aantal dagen voordat een beloning verloopt'),
('max_referrals_per_customer', '0', 'Maximum aantal referrals per klant (0 = onbeperkt)'),
('auto_approve_referrals', 'false', 'Automatisch goedkeuren van referrals'),
('require_booking_reference', 'false', 'Vereist boekingreferentie voor referrals'),
('company_name', 'Bebsy Tours', 'Bedrijfsnaam'),
('contact_email', 'info@bebsy.nl', 'Contact email adres'),
('currency_symbol', '€', 'Valuta symbool'),
('date_format', 'DD-MM-YYYY', 'Datum formaat'),
('timezone', 'Europe/Amsterdam', 'Tijdzone');

-- Create function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(8) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(8) := '';
    i INTEGER;
    char_index INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        char_index := floor(random() * length(chars) + 1);
        result := result || substr(chars, char_index, 1);
    END LOOP;
    
    -- Check if code already exists
    WHILE EXISTS (SELECT 1 FROM customers WHERE referral_code = result) LOOP
        result := '';
        FOR i IN 1..8 LOOP
            char_index := floor(random() * length(chars) + 1);
            result := result || substr(chars, char_index, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically generate referral code on customer insert
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating referral codes
CREATE TRIGGER customers_auto_referral_code
    BEFORE INSERT ON customers
    FOR EACH ROW EXECUTE FUNCTION auto_generate_referral_code();

-- Create function to check reward limits
CREATE OR REPLACE FUNCTION check_reward_limits()
RETURNS TRIGGER AS $$
DECLARE
    max_referrals INTEGER;
    current_referrals INTEGER;
BEGIN
    -- Get max referrals setting
    SELECT value::INTEGER INTO max_referrals 
    FROM system_settings 
    WHERE key = 'max_referrals_per_customer';
    
    -- If limit is 0, no limit is set
    IF max_referrals = 0 THEN
        RETURN NEW;
    END IF;
    
    -- Count current referrals for this customer
    SELECT COUNT(*) INTO current_referrals
    FROM referrals
    WHERE referrer_id = NEW.referrer_id;
    
    -- Check if limit would be exceeded
    IF current_referrals >= max_referrals THEN
        RAISE EXCEPTION 'Maximum aantal referrals bereikt voor deze klant (%)!', max_referrals;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reward limits
CREATE TRIGGER check_referral_limits
    BEFORE INSERT ON referrals
    FOR EACH ROW EXECUTE FUNCTION check_reward_limits();

-- Create materialized view for performance on large datasets
CREATE MATERIALIZED VIEW customer_performance AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.referral_code,
    COUNT(r.id) as referral_count,
    COALESCE(SUM(CASE WHEN r.reward_status IN ('approved', 'paid') THEN 1 ELSE 0 END), 0) as successful_referrals,
    COALESCE(SUM(rw.amount), 0) as total_rewards,
    CASE 
        WHEN COUNT(r.id) > 0 THEN 
            ROUND((SUM(CASE WHEN r.reward_status IN ('approved', 'paid') THEN 1 ELSE 0 END)::decimal / COUNT(r.id)) * 100, 2)
        ELSE 0 
    END as conversion_rate,
    c.created_at,
    MAX(r.created_at) as last_activity
FROM customers c
LEFT JOIN referrals r ON c.id = r.referrer_id
LEFT JOIN rewards rw ON c.id = rw.customer_id AND rw.status = 'paid'
GROUP BY c.id, c.name, c.email, c.referral_code, c.created_at;

-- Create index on materialized view
CREATE INDEX idx_customer_performance_referral_count ON customer_performance(referral_count);
CREATE INDEX idx_customer_performance_conversion_rate ON customer_performance(conversion_rate);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_customer_performance()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW customer_performance;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to bebsy_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bebsy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bebsy_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO bebsy_user;

-- Create backup function
CREATE OR REPLACE FUNCTION create_backup()
RETURNS TABLE(backup_info TEXT) AS $
DECLARE
    backup_timestamp TEXT;
BEGIN
    backup_timestamp := to_char(now(), 'YYYY-MM-DD_HH24-MI-SS');
    
    RETURN QUERY SELECT 'Backup created at: ' || backup_timestamp;
    
    -- Note: Actual backup creation should be done via pg_dump externally
    -- This function can be extended to log backup operations
    
    INSERT INTO audit_log (table_name, record_id, action, new_values)
    VALUES ('system', gen_random_uuid(), 'BACKUP', json_build_object('timestamp', backup_timestamp));
END;
$ LANGUAGE plpgsql;

-- Create data cleanup function for old records
CREATE OR REPLACE FUNCTION cleanup_old_data(days_to_keep INTEGER DEFAULT 365)
RETURNS TABLE(cleanup_info TEXT) AS $
DECLARE
    deleted_audit_logs INTEGER;
    deleted_notifications INTEGER;
BEGIN
    -- Clean up old audit logs
    DELETE FROM audit_log 
    WHERE changed_at < (CURRENT_DATE - INTERVAL '1 day' * days_to_keep);
    GET DIAGNOSTICS deleted_audit_logs = ROW_COUNT;
    
    -- Clean up old read notifications
    DELETE FROM notifications 
    WHERE is_read = true AND created_at < (CURRENT_DATE - INTERVAL '30 days');
    GET DIAGNOSTICS deleted_notifications = ROW_COUNT;
    
    -- Refresh materialized view
    REFRESH MATERIALIZED VIEW customer_performance;
    
    RETURN QUERY SELECT 'Cleaned up ' || deleted_audit_logs || ' audit logs and ' || deleted_notifications || ' notifications';
END;
$ LANGUAGE plpgsql;

-- Create database health check function
CREATE OR REPLACE FUNCTION database_health_check()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $
BEGIN
    -- Check table sizes
    RETURN QUERY
    SELECT 
        'Table: ' || schemaname || '.' || tablename as check_name,
        CASE WHEN pg_total_relation_size(schemaname||'.'||tablename) > 1000000000 THEN 'WARNING' ELSE 'OK' END as status,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as details
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    
    -- Check for unused indexes
    RETURN QUERY
    SELECT 
        'Index: ' || indexrelname as check_name,
        CASE WHEN idx_scan = 0 THEN 'WARNING' ELSE 'OK' END as status,
        'Scans: ' || idx_scan::TEXT as details
    FROM pg_stat_user_indexes
    WHERE idx_scan < 10
    ORDER BY idx_scan;
END;
$ LANGUAGE plpgsql;

-- Insert sample data for testing (comment out for production)
/*
-- Sample customers
INSERT INTO customers (bebsy_customer_id, name, email, referral_code) VALUES
('CUST001', 'Jan Jansen', 'jan.jansen@example.com', 'ABC12345'),
('CUST002', 'Maria Smit', 'maria.smit@example.com', 'DEF67890'),
('CUST003', 'Piet de Vries', 'piet.vries@example.com', 'GHI13579');

-- Sample referrals
INSERT INTO referrals (referrer_id, new_customer_email, booking_reference, reward_status) VALUES
((SELECT id FROM customers WHERE email = 'jan.jansen@example.com'), 'nieuwe.klant1@example.com', 'BOOK001', 'approved'),
((SELECT id FROM customers WHERE email = 'maria.smit@example.com'), 'nieuwe.klant2@example.com', 'BOOK002', 'pending'),
((SELECT id FROM customers WHERE email = 'jan.jansen@example.com'), 'nieuwe.klant3@example.com', 'BOOK003', 'paid');

-- Sample rewards
INSERT INTO rewards (customer_id, amount, type, status, description) VALUES
((SELECT id FROM customers WHERE email = 'jan.jansen@example.com'), 25.00, 'credit', 'paid', 'Referral beloning voor nieuwe.klant1@example.com'),
((SELECT id FROM customers WHERE email = 'jan.jansen@example.com'), 25.00, 'credit', 'approved', 'Referral beloning voor nieuwe.klant3@example.com');
*/

-- Final setup completion message
DO $
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Bebsy Referral System Database Initialization Complete!';
    RAISE NOTICE '';
    RAISE NOTICE 'Database: bebsy_referral_system';
    RAISE NOTICE 'Tables created: % ', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE 'Views created: % ', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public');
    RAISE NOTICE 'Functions created: % ', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Change the default admin password!';
    RAISE NOTICE '   Username: admin';
    RAISE NOTICE '   Password: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '   1. Update system_settings for your configuration';
    RAISE NOTICE '   2. Create additional admin users if needed';
    RAISE NOTICE '   3. Set up regular backups';
    RAISE NOTICE '   4. Configure monitoring and alerts';
    RAISE NOTICE '';
END $;