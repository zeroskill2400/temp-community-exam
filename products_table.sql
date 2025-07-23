-- products 테이블 생성
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- products 테이블에 RLS 정책 활성화
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 상품을 읽을 수 있도록 허용
CREATE POLICY "Anyone can read products" ON products
    FOR SELECT USING (true);

-- 샘플 상품 데이터 추가
INSERT INTO products (name, description, price, image, stock_quantity, category) VALUES
('맥북 프로 14인치', 'Apple M2 Pro 칩이 탑재된 강력한 노트북입니다. 개발자와 크리에이터를 위한 완벽한 선택입니다.', 2590000, '', 10, '노트북'),
('아이패드 에어', '가벼우면서도 강력한 성능을 자랑하는 아이패드입니다. 업무와 창작 활동에 이상적입니다.', 859000, '', 15, '태블릿'),
('에어팟 프로', '액티브 노이즈 캔슬링 기능이 있는 무선 이어폰입니다. 최고의 음질을 경험해보세요.', 359000, '', 25, '오디오'),
('아이폰 15 Pro', '최신 A17 Pro 칩과 48MP 카메라가 탑재된 프리미엄 스마트폰입니다.', 1550000, '', 20, '스마트폰'),
('매직 키보드', '백라이트가 있는 무선 키보드로 Mac과 완벽하게 호환됩니다.', 165000, '', 30, '액세서리'),
('애플 워치 시리즈 9', '건강과 피트니스를 위한 최고의 스마트워치입니다.', 599000, '', 18, '웨어러블'),
('맥 스튜디오', '프로페셔널 워크플로우를 위한 강력한 데스크톱 컴퓨터입니다.', 2590000, '', 5, '데스크톱'),
('에어팟 맥스', '프리미엄 오버이어 헤드폰으로 최고의 음질을 제공합니다.', 769000, '', 12, '오디오');

-- 주문 테이블 생성 (향후 확장용)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- order_items 테이블 생성 (향후 확장용)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- orders 테이블에 RLS 정책 활성화
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 주문만 볼 수 있음
CREATE POLICY "Users can read their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 주문만 생성할 수 있음
CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- order_items 테이블에 RLS 정책 활성화
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 주문 아이템만 볼 수 있음
CREATE POLICY "Users can read their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    ); 