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
