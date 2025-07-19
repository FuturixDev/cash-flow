-- 刪除所有現有的表和相關對象
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_owner(UUID) CASCADE;
DROP FUNCTION IF EXISTS set_user_id() CASCADE;

-- 創建交易表
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT gen_random_uuid(),  -- 改為可選
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_role VARCHAR(20) DEFAULT 'user'
);

-- 啟用行級安全策略
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 創建策略
CREATE POLICY "Enable read access for authenticated users"
    ON transactions FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON transactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON transactions FOR UPDATE
    USING (true);

CREATE POLICY "Enable delete for authenticated users"
    ON transactions FOR DELETE
    USING (true);

-- 創建索引
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- 設置默認權限
GRANT SELECT, INSERT, UPDATE, DELETE ON transactions TO authenticated; 