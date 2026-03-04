-- 008_performance_trigger.sql
-- 정산 완료 시 가이드 성과 데이터 자동 누적 트리거

-- 1. 정산 완료 시 가이드 성과 로그(guide_performance_logs) 자동 INSERT
CREATE OR REPLACE FUNCTION fn_log_guide_performance()
RETURNS TRIGGER AS $$
DECLARE
  v_guide_id UUID;
BEGIN
  -- status가 'Completed'로 변경된 경우에만 실행
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    
    -- 관련 가이드 배정 정보 조회
    SELECT ga."assignedGuideId" INTO v_guide_id
    FROM guide_assignments ga
    WHERE ga."quotationId" = NEW."quotationId"
    AND ga.status IN ('Assigned', 'In Progress', 'Completed')
    LIMIT 1;

    -- 가이드가 배정되어 있는 경우에만 로그 삽입
    IF v_guide_id IS NOT NULL THEN
      INSERT INTO guide_performance_logs (
        guide_id,
        settlement_id,
        tour_date,
        shopping_revenue,
        option_revenue,
        complaint_count,
        client_rating,
        notes
      ) VALUES (
        v_guide_id,
        NEW.id,
        NOW(),
        COALESCE(NEW."shoppingCommission", 0),
        COALESCE(NEW."optionCommission", 0),
        0,
        0,
        '정산 완료 시 자동 생성'
      );

      -- 2. 가이드 프로필의 누적 수치 자동 업데이트
      UPDATE guide_profiles SET
        total_tours = COALESCE(total_tours, 0) + 1,
        total_shopping_revenue = COALESCE(total_shopping_revenue, 0) + COALESCE(NEW."shoppingCommission", 0),
        total_option_revenue = COALESCE(total_option_revenue, 0) + COALESCE(NEW."optionCommission", 0),
        updated_at = NOW()
      WHERE id = v_guide_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 트리거 등록
DROP TRIGGER IF EXISTS trg_settlement_completed ON settlements;
CREATE TRIGGER trg_settlement_completed
  AFTER UPDATE ON settlements
  FOR EACH ROW
  EXECUTE FUNCTION fn_log_guide_performance();

-- 4. 가이드 배정 테이블에 quotationId가 없으면 추가 (FK 연결용)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guide_assignments' AND column_name = 'quotationId'
  ) THEN
    ALTER TABLE guide_assignments ADD COLUMN "quotationId" UUID REFERENCES quotations(id);
  END IF;
END $$;
