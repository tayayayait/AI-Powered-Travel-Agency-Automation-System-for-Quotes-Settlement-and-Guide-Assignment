-- 009_seed_data.sql
-- 테스트 데이터 (Seed Data) 삽입
-- 모든 페이지가 정상적으로 데이터를 표시할 수 있도록 합니다.

-- ── 시스템 설정 ──
INSERT INTO public.system_settings (id, "baseCurrency", language, timezone, rates)
VALUES ('default', 'KRW', 'ko', 'Asia/Seoul', '{"THB": 39.5, "VND": 0.055, "LAK": 0.062}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ── 가이드 프로필 (기존 2건 이미 001에서 삽입됨, 추가 2건) ──
INSERT INTO public.guide_profiles (id, name, phone, languages, rating, tier, total_tours, total_shopping_revenue, total_option_revenue, complaint_count, regions, specialties, status) VALUES
('a1111111-1111-1111-1111-111111111111', '이수진', '+66-92-111-2222', '{"Korean", "Thai", "English"}', 4.9, 'Gold', 25, 1500000, 800000, 0, '{"방콕", "파타야", "치앙마이"}', '{"골프투어", "허니문"}', 'Active'),
('a2222222-2222-2222-2222-222222222222', '최태호', '+84-90-333-4444', '{"Korean", "Vietnamese"}', 4.3, 'Silver', 12, 600000, 300000, 1, '{"하노이", "다낭", "호치민"}', '{"문화탐방", "단체여행"}', 'Active')
ON CONFLICT (id) DO NOTHING;

-- 기존 가이드 프로필 업데이트 (tier, regions 등 007 마이그레이션에서 추가된 컬럼)
UPDATE public.guide_profiles SET
  tier = 'Platinum', total_tours = 45, total_shopping_revenue = 3200000,
  total_option_revenue = 1500000, complaint_count = 1,
  regions = '{"방콕", "파타야", "푸켓"}', specialties = '{"쇼핑투어", "단체투어"}', status = 'Active'
WHERE name = '김가이드';

UPDATE public.guide_profiles SET
  tier = 'Silver', total_tours = 18, total_shopping_revenue = 900000,
  total_option_revenue = 400000, complaint_count = 0,
  regions = '{"방콕", "치앙마이"}', specialties = '{"템플투어", "에코투어"}', status = 'Active'
WHERE name = '박가이드';

-- ── 견적 (Quotations) ──
INSERT INTO public.quotations (id, title, "clientName", "startDate", "endDate", "paxCount", "targetMarginPercentage", "actualMarginPercentage", status, "totalCostKRW", "proposedPriceKRW", currency, "packageType") VALUES
('01111111-1111-1111-1111-111111111111', '방콕-파타야 5일 인센티브 투어', '(주)한빛전자', '2026-03-15', '2026-03-19', 30, 15, 18.5, 'Approved', 45000000, 53250000, 'KRW', 'incentive'),
('02222222-2222-2222-2222-222222222222', '다낭 4일 가족여행 패키지', '김영희 외 가족', '2026-03-20', '2026-03-23', 8, 12, 0, 'Draft', 12000000, 13440000, 'KRW', 'standard'),
('03333333-3333-3333-3333-333333333333', '치앙마이 골프 6일 프리미엄', '삼성물산 임원진', '2026-04-01', '2026-04-06', 12, 20, 22.3, 'Locked', 36000000, 43920000, 'KRW', 'premium'),
('04444444-4444-4444-4444-444444444444', '푸켓 3일 허니문 세이브', '이정윤 부부', '2026-04-10', '2026-04-12', 2, 10, 0, 'InReview', 3500000, 3850000, 'KRW', 'save'),
('05555555-5555-5555-5555-555555555555', '하노이 문화탐방 5일', '서울시 공무원 연수단', '2026-03-10', '2026-03-14', 20, 12, 0, 'Rejected', 28000000, 31360000, 'KRW', 'standard');

-- ── 견적 일정 (Quotation Schedules) ──
INSERT INTO public.quotation_schedules (quotation_id, "dayNumber", date, description) VALUES
('01111111-1111-1111-1111-111111111111', 1, '2026-03-15', '인천 출발 → 방콕 도착, 호텔 체크인, 환영 만찬'),
('01111111-1111-1111-1111-111111111111', 2, '2026-03-16', '방콕 시내 관광 (왕궁, 왓포), 쇼핑 (짜뚜짝 마켓)'),
('01111111-1111-1111-1111-111111111111', 3, '2026-03-17', '파타야 이동, 산호섬 투어, 해양 스포츠'),
('01111111-1111-1111-1111-111111111111', 4, '2026-03-18', '파타야 골프 (시암 컨트리클럽), 알카자 쇼'),
('01111111-1111-1111-1111-111111111111', 5, '2026-03-19', '호텔 체크아웃, 방콕 공항 이동, 인천 도착'),
('02222222-2222-2222-2222-222222222222', 1, '2026-03-20', '인천 출발 → 다낭 도착, 리조트 체크인'),
('02222222-2222-2222-2222-222222222222', 2, '2026-03-21', '바나힐 테마파크, 골든브릿지 관광'),
('02222222-2222-2222-2222-222222222222', 3, '2026-03-22', '호이안 올드타운, 쿠킹 클래스'),
('02222222-2222-2222-2222-222222222222', 4, '2026-03-23', '자유시간 후 공항 이동, 귀국');

-- ── 견적 비용 (Quotation Costs) ──
INSERT INTO public.quotation_costs (quotation_id, category, description, "unitPrice", quantity, days, currency, "exchangeRate", "calcAmountKRW") VALUES
('01111111-1111-1111-1111-111111111111', 'Hotel', '방콕 메리어트 호텔 (트윈룸)', 4500, 15, 2, 'THB', 39.5, 5332500),
('01111111-1111-1111-1111-111111111111', 'Hotel', '파타야 힐튼 호텔 (트윈룸)', 5000, 15, 2, 'THB', 39.5, 5925000),
('01111111-1111-1111-1111-111111111111', 'Transport', '전용 버스 (45인승)', 25000, 1, 5, 'THB', 39.5, 4937500),
('01111111-1111-1111-1111-111111111111', 'Guide', '한국어 가이드비', 3000, 1, 5, 'THB', 39.5, 592500),
('01111111-1111-1111-1111-111111111111', 'Meal', '단체 식사 (30인 기준)', 800, 30, 5, 'THB', 39.5, 4740000),
('02222222-2222-2222-2222-222222222222', 'Hotel', '다낭 인터컨티넨탈 (패밀리룸)', 180000, 2, 3, 'VND', 0.055, 59400),
('02222222-2222-2222-2222-222222222222', 'Transport', '미니밴 렌트', 2500000, 1, 4, 'VND', 0.055, 550000),
('02222222-2222-2222-2222-222222222222', 'Ticket', '바나힐 입장료', 900000, 8, 1, 'VND', 0.055, 396000);

-- ── 정산 (Settlements) ──
INSERT INTO public.settlements (id, "quotationId", title, "clientName", status, "totalExpectedKRW", "totalActualKRW", "balanceKRW", "guideFee", "shoppingCommission", "optionCommission", "profitKRW", "profitRate") VALUES
('b1111111-1111-1111-1111-111111111111', '01111111-1111-1111-1111-111111111111', '방콕-파타야 5일 인센티브 투어', '(주)한빛전자', 'Completed', 45000000, 43200000, 1800000, 1500000, 2400000, 800000, 11700000, 22.0),
('b2222222-2222-2222-2222-222222222222', '03333333-3333-3333-3333-333333333333', '치앙마이 골프 6일 프리미엄', '삼성물산 임원진', 'Pending', 36000000, 0, 0, 0, 0, 0, 0, 0);

-- ── 정산 비용 (Settlement Expenses) ──
INSERT INTO public.settlement_expenses (settlement_id, category, description, "amountExpected", "amountActual", currency) VALUES
('b1111111-1111-1111-1111-111111111111', 'Hotel', '방콕 메리어트 호텔', 5332500, 5100000, 'KRW'),
('b1111111-1111-1111-1111-111111111111', 'Hotel', '파타야 힐튼 호텔', 5925000, 5925000, 'KRW'),
('b1111111-1111-1111-1111-111111111111', 'Transport', '전용 버스', 4937500, 4800000, 'KRW'),
('b1111111-1111-1111-1111-111111111111', 'Meal', '단체 식사', 4740000, 4500000, 'KRW');

-- ── 쇼핑 매출 (Shopping Sales) ──
INSERT INTO public.shopping_sales (settlement_id, shop_name, sales_amount, commission_rate, guide_share, company_share, currency) VALUES
('b1111111-1111-1111-1111-111111111111', '킹파워 면세점', 8000000, 10, 400000, 400000, 'THB'),
('b1111111-1111-1111-1111-111111111111', '짜뚜짝 제휴 쇼핑몰', 4000000, 8, 160000, 160000, 'THB');

-- ── 옵션 매출 (Option Sales) ──
INSERT INTO public.option_sales (settlement_id, option_name, quantity, unit_price, total_amount, guide_share_rate, guide_share, company_share, currency) VALUES
('b1111111-1111-1111-1111-111111111111', '산호섬 스피드보트', 25, 1500, 37500, 40, 15000, 22500, 'THB'),
('b1111111-1111-1111-1111-111111111111', '알카자 쇼 VIP석', 30, 800, 24000, 30, 7200, 16800, 'THB');

-- ── 가이드 배정 (Guide Assignments) ──
INSERT INTO public.guide_assignments (id, "quotationId", title, "clientName", "startDate", "endDate", status, "assignedGuideId", "meetingPoint", notes, ai_score) VALUES
('da111111-1111-1111-1111-111111111111', '01111111-1111-1111-1111-111111111111', '방콕-파타야 5일 인센티브 투어', '(주)한빛전자', '2026-03-15', '2026-03-19', 'Completed', (SELECT id FROM public.guide_profiles WHERE name = '김가이드'), '수완나품 공항 3번 게이트', '30인 단체, VIP 의전 필요', 92.5),
('da222222-2222-2222-2222-222222222222', '03333333-3333-3333-3333-333333333333', '치앙마이 골프 6일 프리미엄', '삼성물산 임원진', '2026-04-01', '2026-04-06', 'Assigned', 'a1111111-1111-1111-1111-111111111111', '치앙마이 공항 픽업', '골프 전문 가이드 배정', 88.0),
('da333333-3333-3333-3333-333333333333', '02222222-2222-2222-2222-222222222222', '다낭 4일 가족여행 패키지', '김영희 외 가족', '2026-03-20', '2026-03-23', 'Pending', NULL, NULL, '소규모 가족, 아이 동반', NULL),
('da444444-4444-4444-4444-444444444444', '04444444-4444-4444-4444-444444444444', '푸켓 3일 허니문 세이브', '이정윤 부부', '2026-04-10', '2026-04-12', 'Pending', NULL, NULL, '허니문 커플, 프라이빗 투어 선호', NULL);

-- ── 승인 이력 (Approval Logs) ──
INSERT INTO public.approval_logs (quotation_id, previous_status, new_status, changed_by, reason) VALUES
('01111111-1111-1111-1111-111111111111', 'Draft', 'InReview', 'system', '견적 검토 요청'),
('01111111-1111-1111-1111-111111111111', 'InReview', 'Approved', 'system', '견적 승인 완료 — 마진 18.5% 확보'),
('03333333-3333-3333-3333-333333333333', 'Approved', 'Locked', 'system', '계약 확정 및 잠금'),
('05555555-5555-5555-5555-555555555555', 'InReview', 'Rejected', 'system', '마진율 부족 (12% 미만), 비용 재검토 필요');

-- ── 가이드 성과 로그 (Guide Performance Logs) ──
INSERT INTO public.guide_performance_logs (guide_id, assignment_id, settlement_id, tour_title, start_date, end_date, shopping_revenue, option_revenue, customer_rating, has_complaint, complaint_details) VALUES
((SELECT id FROM public.guide_profiles WHERE name = '김가이드'), 'da111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '방콕-파타야 5일 인센티브 투어', '2026-03-15', '2026-03-19', 1200000, 500000, 4.8, false, NULL);

