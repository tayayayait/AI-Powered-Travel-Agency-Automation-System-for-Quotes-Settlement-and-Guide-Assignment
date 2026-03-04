```xml
<?xml version='1.0' encoding='utf-8'?>
<uiUxSpecDocument lang="ko-KR">
  <title>UI/UX 구현 상세서 (동남아 랜드사 통합 운영 시스템 / Phase 1~3)</title>
  <source>
    <file>상세서.md</file>
  </source>
  <body>
    <section level="2" title="문서 요약(결정 사항)" id="0">
      <table>
        <columns>
          <column tag="item" label="항목" />
          <column tag="value" label="값(HEX·px·ms)" />
          <column tag="useCase" label="사용처" />
          <column tag="rule" label="규칙" />
        </columns>
        <rows>
          <row>
            <item>적용 스킬</item>
            <value>`ui-ux-pro-max` → `writing-clearly-and-concisely` → `prompt-engineering`</value>
            <useCase>본 상세서 작성 기준</useCase>
            <rule>접근성/반응형/상태 설계 우선, 규칙은 짧고 실행 가능하게 작성, 표 템플릿 일관 유지</rule>
          </row>
          <row>
            <item>기본 UI 모드</item>
            <value>Light (다크모드 미포함)</value>
            <useCase>전 화면</useCase>
            <rule>다크모드는 추후 토큰 확장으로 대응(Assumptions 참조)</rule>
          </row>
          <row>
            <item>최우선 UX 목표</item>
            <value>“입력→검증→승인→출력” 1 플로우 5분 내 완주</value>
            <useCase>Phase 1 견적</useCase>
            <rule>자동계산·자동검증·승인 전 외부반출 차단(버튼/출력 비활성)</rule>
          </row>
          <row>
            <item>정보 구조(PC)</item>
            <value>좌측 Sidebar + 상단 Topbar + 본문 Workspace</value>
            <useCase>관리자/내근 대시보드</useCase>
            <rule>테이블/필터 중심, 빠른 검색·단축행동 우선</rule>
          </row>
          <row>
            <item>정보 구조(모바일)</item>
            <value>상단 Topbar + 본문 + 하단 고정 Action bar</value>
            <useCase>가이드/현지 소장 폼</useCase>
            <rule>터치 타겟 44×44px, 선택형 입력 우선(수기 계산 금지)</rule>
          </row>
          <row>
            <item>상태 체계(공통)</item>
            <value>Draft / InReview / Approved / Rejected / Locked</value>
            <useCase>견적/정산/배정/리포트</useCase>
            <rule>상태는 Badge로 항상 노출, 상태별 가능한 액션만 활성화</rule>
          </row>
        </rows>
      </table>
      <divider />
    </section>
    <section level="2" title="디자인 토큰(Design Tokens) — “토큰 우선, 하드코딩 금지”" id="1">
      <note>모든 색/간격/모션은 아래 토큰 값으로만 구현한다. (로우코드 툴에서는 Theme/Styles 변수로 매핑)</note>
      <section level="3" title="Color Tokens (Light)" id="1-1">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>color.bg.base</item>
              <value>`#F8FAFC`</value>
              <useCase>앱 배경</useCase>
              <rule>페이지 기본 배경(스크롤 영역 포함)</rule>
            </row>
            <row>
              <item>color.surface.1</item>
              <value>`#FFFFFF`</value>
              <useCase>카드/모달/드로어</useCase>
              <rule>“콘텐츠 표면” 기본</rule>
            </row>
            <row>
              <item>color.surface.2</item>
              <value>`#F1F5F9`</value>
              <useCase>섹션 구분</useCase>
              <rule>표/리포트의 보조 패널 배경</rule>
            </row>
            <row>
              <item>color.border.default</item>
              <value>`#E2E8F0`</value>
              <useCase>입력/카드/테이블</useCase>
              <rule>기본 경계선 1px</rule>
            </row>
            <row>
              <item>color.border.strong</item>
              <value>`#CBD5E1`</value>
              <useCase>강조 경계</useCase>
              <rule>구분이 필요한 영역(hover 포함)</rule>
            </row>
            <row>
              <item>color.text.primary</item>
              <value>`#0F172A`</value>
              <useCase>본문/제목</useCase>
              <rule>기본 텍스트(최소 대비 4.5:1)</rule>
            </row>
            <row>
              <item>color.text.secondary</item>
              <value>`#475569`</value>
              <useCase>보조 설명</useCase>
              <rule>helper/설명/서브 정보</rule>
            </row>
            <row>
              <item>color.text.muted</item>
              <value>`#64748B`</value>
              <useCase>플레이스홀더</useCase>
              <rule>placeholder/비활성 텍스트</rule>
            </row>
            <row>
              <item>color.text.inverse</item>
              <value>`#FFFFFF`</value>
              <useCase>Primary 버튼 등</useCase>
              <rule>어두운 배경 위 텍스트</rule>
            </row>
            <row>
              <item>color.primary.600</item>
              <value>`#2563EB`</value>
              <useCase>핵심 CTA</useCase>
              <rule>Primary 버튼/링크/포커스 핵심</rule>
            </row>
            <row>
              <item>color.primary.700</item>
              <value>`#1D4ED8`</value>
              <useCase>hover</useCase>
              <rule>Primary hover</rule>
            </row>
            <row>
              <item>color.primary.800</item>
              <value>`#1E40AF`</value>
              <useCase>active</useCase>
              <rule>Primary active</rule>
            </row>
            <row>
              <item>color.primary.100</item>
              <value>`#DBEAFE`</value>
              <useCase>포커스/선택</useCase>
              <rule>focus ring 배경/선택 행 배경</rule>
            </row>
            <row>
              <item>color.success.600</item>
              <value>`#16A34A`</value>
              <useCase>성공/승인</useCase>
              <rule>Approved/성공 토스트</rule>
            </row>
            <row>
              <item>color.warning.600</item>
              <value>`#D97706`</value>
              <useCase>경고</useCase>
              <rule>마진 미달/주의 토스트</rule>
            </row>
            <row>
              <item>color.danger.600</item>
              <value>`#DC2626`</value>
              <useCase>오류/거절</useCase>
              <rule>오류/Rejected/차단 메시지</rule>
            </row>
            <row>
              <item>color.info.600</item>
              <value>`#0891B2`</value>
              <useCase>정보</useCase>
              <rule>안내/정보 토스트</rule>
            </row>
            <row>
              <item>color.overlay</item>
              <value>`#0F172A80`</value>
              <useCase>모달/드로어 오버레이</useCase>
              <rule>배경 클릭 차단, 투명도 고정(50%)</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="Typography Tokens (다국어 폰트 포함)" id="1-2">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>font.family.base</item>
              <value>`Noto Sans` 계열</value>
              <useCase>전 화면</useCase>
              <rule>우선순위: Noto Sans KR/Thai/Lao/Vietnamese → Noto Sans → system</rule>
            </row>
            <row>
              <item>font.size.h1</item>
              <value>`24px`</value>
              <useCase>페이지 타이틀</useCase>
              <rule>PC 대시보드 타이틀(줄바꿈 허용)</rule>
            </row>
            <row>
              <item>font.size.h2</item>
              <value>`20px`</value>
              <useCase>섹션 타이틀</useCase>
              <rule>카드/패널 헤더</rule>
            </row>
            <row>
              <item>font.size.h3</item>
              <value>`18px`</value>
              <useCase>서브 타이틀</useCase>
              <rule>탭/모달 타이틀</rule>
            </row>
            <row>
              <item>font.size.body</item>
              <value>`14px`</value>
              <useCase>기본 본문</useCase>
              <rule>표/폼 기본 크기</rule>
            </row>
            <row>
              <item>font.size.bodyLg</item>
              <value>`16px`</value>
              <useCase>모바일 폼</useCase>
              <rule>가이드 입력 폼 기본</rule>
            </row>
            <row>
              <item>font.size.caption</item>
              <value>`12px`</value>
              <useCase>helper/메타</useCase>
              <rule>도움말/라벨 보조</rule>
            </row>
            <row>
              <item>font.weight.regular</item>
              <value>`400`</value>
              <useCase>본문</useCase>
              <rule>기본</rule>
            </row>
            <row>
              <item>font.weight.medium</item>
              <value>`500`</value>
              <useCase>라벨/강조</useCase>
              <rule>입력 라벨/버튼</rule>
            </row>
            <row>
              <item>font.weight.semibold</item>
              <value>`600`</value>
              <useCase>타이틀</useCase>
              <rule>과도한 Bold 금지</rule>
            </row>
            <row>
              <item>line.height.tight</item>
              <value>`20px`</value>
              <useCase>테이블/라벨</useCase>
              <rule>줄간격 고정(가독성 우선)</rule>
            </row>
            <row>
              <item>line.height.base</item>
              <value>`22px`</value>
              <useCase>본문</useCase>
              <rule>다국어 확장 대비(Thai/Lao 포함)</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="Spacing Tokens (4px 스케일)" id="1-3">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>space.0</item>
              <value>`0px`</value>
              <useCase>리셋</useCase>
              <rule>불필요한 공백 금지</rule>
            </row>
            <row>
              <item>space.1</item>
              <value>`4px`</value>
              <useCase>미세 간격</useCase>
              <rule>아이콘-텍스트/배지</rule>
            </row>
            <row>
              <item>space.2</item>
              <value>`8px`</value>
              <useCase>기본 간격</useCase>
              <rule>폼 요소 내부 간격</rule>
            </row>
            <row>
              <item>space.3</item>
              <value>`12px`</value>
              <useCase>컨트롤 간격</useCase>
              <rule>버튼 그룹/필터</rule>
            </row>
            <row>
              <item>space.4</item>
              <value>`16px`</value>
              <useCase>카드 패딩(기본)</useCase>
              <rule>대부분의 카드/섹션</rule>
            </row>
            <row>
              <item>space.5</item>
              <value>`20px`</value>
              <useCase>넓은 패딩</useCase>
              <rule>모달/드로어 기본</rule>
            </row>
            <row>
              <item>space.6</item>
              <value>`24px`</value>
              <useCase>페이지 패딩(PC)</useCase>
              <rule>Workspace padding</rule>
            </row>
            <row>
              <item>space.8</item>
              <value>`32px`</value>
              <useCase>섹션 분리</useCase>
              <rule>대시보드 섹션 간격</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="Radius Tokens" id="1-4">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>radius.sm</item>
              <value>`6px`</value>
              <useCase>입력/배지</useCase>
              <rule>작은 요소</rule>
            </row>
            <row>
              <item>radius.md</item>
              <value>`8px`</value>
              <useCase>버튼/입력/테이블</useCase>
              <rule>기본 라운드</rule>
            </row>
            <row>
              <item>radius.lg</item>
              <value>`12px`</value>
              <useCase>카드</useCase>
              <rule>카드 기본</rule>
            </row>
            <row>
              <item>radius.xl</item>
              <value>`16px`</value>
              <useCase>모달</useCase>
              <rule>모달/드로어 상단</rule>
            </row>
            <row>
              <item>radius.pill</item>
              <value>`9999px`</value>
              <useCase>칩/토글</useCase>
              <rule>완전 원형</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="Shadow Tokens" id="1-5">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>shadow.none</item>
              <value>`0px 0px 0px 0px #00000000`</value>
              <useCase>기본</useCase>
              <rule>기본은 무그림자</rule>
            </row>
            <row>
              <item>shadow.sm</item>
              <value>`0px 1px 2px 0px #0F172A0F`</value>
              <useCase>카드 hover</useCase>
              <rule>과도한 그림자 금지</rule>
            </row>
            <row>
              <item>shadow.md</item>
              <value>`0px 8px 20px -8px #0F172A2E`</value>
              <useCase>모달/토스트</useCase>
              <rule>overlay 위 요소에만</rule>
            </row>
            <row>
              <item>shadow.lg</item>
              <value>`0px 16px 40px -16px #0F172A3D`</value>
              <useCase>큰 드로어</useCase>
              <rule>중요 레이어만</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="Motion Tokens" id="1-6">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>motion.duration.fast</item>
              <value>`150ms`</value>
              <useCase>hover/active</useCase>
              <rule>마이크로 인터랙션</rule>
            </row>
            <row>
              <item>motion.duration.base</item>
              <value>`200ms`</value>
              <useCase>모달/토스트</useCase>
              <rule>열기/닫기 기본</rule>
            </row>
            <row>
              <item>motion.duration.slow</item>
              <value>`300ms`</value>
              <useCase>드로어</useCase>
              <rule>큰 패널 이동</rule>
            </row>
            <row>
              <item>motion.easing.standard</item>
              <value>`cubic-bezier(0.2,0,0,1)`</value>
              <useCase>전환</useCase>
              <rule>가속-감속 표준</rule>
            </row>
            <row>
              <item>motion.skeleton.loop</item>
              <value>`1500ms`</value>
              <useCase>로딩 스켈레톤</useCase>
              <rule>번쩍임 금지, 부드럽게</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="Z-Index Tokens" id="1-7">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>z.base</item>
              <value>`0`</value>
              <useCase>일반 레이어</useCase>
              <rule>기본</rule>
            </row>
            <row>
              <item>z.sticky</item>
              <value>`10`</value>
              <useCase>sticky header/table head</useCase>
              <rule>sticky끼리 충돌 금지</rule>
            </row>
            <row>
              <item>z.dropdown</item>
              <value>`20`</value>
              <useCase>셀렉트/메뉴</useCase>
              <rule>오버플로우 위</rule>
            </row>
            <row>
              <item>z.overlay</item>
              <value>`30`</value>
              <useCase>오버레이</useCase>
              <rule>모달/드로어 배경</rule>
            </row>
            <row>
              <item>z.modal</item>
              <value>`40`</value>
              <useCase>모달/드로어</useCase>
              <rule>최상단 콘텐츠</rule>
            </row>
            <row>
              <item>z.toast</item>
              <value>`50`</value>
              <useCase>토스트</useCase>
              <rule>항상 최상단</rule>
            </row>
          </rows>
        </table>
        <divider />
      </section>
    </section>
    <section level="2" title="레이아웃 규칙(PC/모바일 공통)" id="2">
      <section level="3" title="브레이크포인트" id="2-1">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>bp.xs</item>
              <value>`360px`</value>
              <useCase>최소 모바일</useCase>
              <rule>가이드 폼 최저 지원폭</rule>
            </row>
            <row>
              <item>bp.sm</item>
              <value>`480px`</value>
              <useCase>큰 모바일</useCase>
              <rule>2열 금지(1열 유지)</rule>
            </row>
            <row>
              <item>bp.md</item>
              <value>`768px`</value>
              <useCase>태블릿</useCase>
              <rule>사이드바=오프캔버스</rule>
            </row>
            <row>
              <item>bp.lg</item>
              <value>`1024px`</value>
              <useCase>데스크탑</useCase>
              <rule>좌측 고정 Sidebar 시작</rule>
            </row>
            <row>
              <item>bp.xl</item>
              <value>`1280px`</value>
              <useCase>와이드</useCase>
              <rule>테이블 밀도/필터 확장</rule>
            </row>
            <row>
              <item>bp.2xl</item>
              <value>`1440px`</value>
              <useCase>최대 기준</useCase>
              <rule>컨테이너 max 기준</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="그리드/컨테이너" id="2-2">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>container.max</item>
              <value>`1440px`</value>
              <useCase>PC 본문</useCase>
              <rule>대시보드는 max 1440, 테이블은 필요 시 fluid</rule>
            </row>
            <row>
              <item>page.padding.mobile</item>
              <value>`16px`</value>
              <useCase>모바일</useCase>
              <rule>좌우 여백 고정</rule>
            </row>
            <row>
              <item>page.padding.tablet</item>
              <value>`20px`</value>
              <useCase>태블릿</useCase>
              <rule>좌우 여백 고정</rule>
            </row>
            <row>
              <item>page.padding.desktop</item>
              <value>`24px`</value>
              <useCase>PC</useCase>
              <rule>좌우 여백 고정</rule>
            </row>
            <row>
              <item>grid.columns.desktop</item>
              <value>`12`</value>
              <useCase>PC</useCase>
              <rule>카드/리포트 12컬럼 기반</rule>
            </row>
            <row>
              <item>grid.gutter.mobile</item>
              <value>`16px`</value>
              <useCase>모바일</useCase>
              <rule>카드 간격</rule>
            </row>
            <row>
              <item>grid.gutter.desktop</item>
              <value>`24px`</value>
              <useCase>PC</useCase>
              <rule>섹션 간격</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="내비게이션(권한/역할 기반)" id="2-3">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>sidebar.width</item>
              <value>`280px`</value>
              <useCase>PC</useCase>
              <rule>메뉴 텍스트 1줄(줄임표 허용)</rule>
            </row>
            <row>
              <item>sidebar.collapsed</item>
              <value>`72px`</value>
              <useCase>PC</useCase>
              <rule>아이콘+툴팁 필수</rule>
            </row>
            <row>
              <item>topbar.height</item>
              <value>`56px`</value>
              <useCase>PC/모바일</useCase>
              <rule>검색/알림/언어/통화 토글 위치</rule>
            </row>
            <row>
              <item>mobile.actionbar.height</item>
              <value>`64px`</value>
              <useCase>모바일 폼</useCase>
              <rule>“임시저장/제출” 고정, 스크롤과 분리</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="스크롤/고정(sticky) 규칙" id="2-4">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>sticky.header</item>
              <value>`z=10`</value>
              <useCase>테이블 헤더</useCase>
              <rule>헤더 높이 고정, 가려짐 금지</rule>
            </row>
            <row>
              <item>sticky.filters</item>
              <value>`top:56px`</value>
              <useCase>목록 필터</useCase>
              <rule>Topbar 아래에 고정(PC)</rule>
            </row>
            <row>
              <item>body.scroll.lock</item>
              <value>`true`</value>
              <useCase>모달 오픈 시</useCase>
              <rule>배경 스크롤 금지</rule>
            </row>
            <row>
              <item>table.hScroll</item>
              <value>`min:360px`</value>
              <useCase>모바일 테이블</useCase>
              <rule>컬럼 많은 경우 가로 스크롤 허용(헤더/첫 컬럼 sticky 권장)</rule>
            </row>
          </rows>
        </table>
        <divider />
      </section>
    </section>
    <section level="2" title="컴포넌트 규격(필수) — 공통 상태 포함" id="3">
      <section level="3" title="Button" id="3-1">
        <section level="4" title="A) 기본 규격">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Button.height.sm</item>
                <value>`32px`</value>
                <useCase>보조 액션</useCase>
                <rule>테이블 상단 필터/보조 버튼</rule>
              </row>
              <row>
                <item>Button.height.md</item>
                <value>`40px`</value>
                <useCase>기본</useCase>
                <rule>대부분의 화면</rule>
              </row>
              <row>
                <item>Button.height.lg</item>
                <value>`48px`</value>
                <useCase>모바일 주요 CTA</useCase>
                <rule>가이드 제출/확정</rule>
              </row>
              <row>
                <item>Button.radius</item>
                <value>`8px`</value>
                <useCase>전 버튼</useCase>
                <rule>radius.md 고정</rule>
              </row>
              <row>
                <item>Button.paddingX.sm</item>
                <value>`12px`</value>
                <useCase>sm</useCase>
                <rule>최소 터치 44×44는 별도 보장(모바일)</rule>
              </row>
              <row>
                <item>Button.paddingX.md</item>
                <value>`16px`</value>
                <useCase>md</useCase>
                <rule>텍스트 1줄 유지</rule>
              </row>
              <row>
                <item>Button.paddingX.lg</item>
                <value>`20px`</value>
                <useCase>lg</useCase>
                <rule>긴 라벨은 줄임표+툴팁</rule>
              </row>
              <row>
                <item>Button.icon.size</item>
                <value>`16px`</value>
                <useCase>아이콘 버튼</useCase>
                <rule>아이콘만 버튼은 44×44px</rule>
              </row>
              <row>
                <item>Button.gap</item>
                <value>`8px`</value>
                <useCase>아이콘+텍스트</useCase>
                <rule>간격 고정</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="B) 상태(Variant 공통 룰 + 색상 값 고정)">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Button/상태/default</item>
                <value>Primary: bg `#2563EB`, text `#FFFFFF` / Secondary: bg `#FFFFFF`, border `#CBD5E1`, text `#0F172A`</value>
                <useCase>기본</useCase>
                <rule>Primary=최대 1개/화면, Secondary=보조</rule>
              </row>
              <row>
                <item>Button/상태/hover</item>
                <value>Primary bg `#1D4ED8` / Secondary bg `#F8FAFC`, border `#CBD5E1`</value>
                <useCase>마우스</useCase>
                <rule>hover로 레이아웃 변형 금지</rule>
              </row>
              <row>
                <item>Button/상태/active</item>
                <value>Primary bg `#1E40AF` / Secondary bg `#F1F5F9`</value>
                <useCase>클릭 중</useCase>
                <rule>active는 150ms 이내, 흔들림 금지</rule>
              </row>
              <row>
                <item>Button/상태/focus</item>
                <value>ring `2px #DBEAFE`, outline `0px`</value>
                <useCase>키보드</useCase>
                <rule>포커스는 항상 보이게(제거 금지)</rule>
              </row>
              <row>
                <item>Button/상태/disabled</item>
                <value>bg `#E2E8F0`, text `#64748B`</value>
                <useCase>비활성</useCase>
                <rule>disabled는 클릭/탭 불가 + 이유 툴팁(가능하면)</rule>
              </row>
              <row>
                <item>Button/상태/loading</item>
                <value>spinner `16px`, text opacity `70%`, duration `200ms`</value>
                <useCase>비동기</useCase>
                <rule>로딩 중 중복 클릭 방지(자동 disabled)</rule>
              </row>
              <row>
                <item>Button/상태/error</item>
                <value>border `1px #DC2626`, shake `150ms`(선택)</value>
                <useCase>실패 피드백</useCase>
                <rule>실패는 Toast error + 버튼은 원상 복구(반복 클릭 유도 금지)</rule>
              </row>
            </rows>
          </table>
          <divider />
        </section>
      </section>
      <section level="3" title="Input (Text/Number/Currency 공통)" id="3-2">
        <section level="4" title="A) 기본 규격">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Input.height</item>
                <value>`40px`</value>
                <useCase>PC 기본</useCase>
                <rule>테이블 필터/폼</rule>
              </row>
              <row>
                <item>Input.height.mobile</item>
                <value>`48px`</value>
                <useCase>모바일 폼</useCase>
                <rule>터치 타겟 확보</rule>
              </row>
              <row>
                <item>Input.radius</item>
                <value>`8px`</value>
                <useCase>전 입력</useCase>
                <rule>radius.md</rule>
              </row>
              <row>
                <item>Input.paddingX</item>
                <value>`12px`</value>
                <useCase>전 입력</useCase>
                <rule>prefix/suffix 포함 시 `12px` 유지</rule>
              </row>
              <row>
                <item>Input.border</item>
                <value>`1px #E2E8F0`</value>
                <useCase>기본</useCase>
                <rule>기본 경계선</rule>
              </row>
              <row>
                <item>Label.size</item>
                <value>`13px`</value>
                <useCase>라벨</useCase>
                <rule>weight 500, 필수(*)는 라벨 우측</rule>
              </row>
              <row>
                <item>Helper.size</item>
                <value>`12px`</value>
                <useCase>도움말</useCase>
                <rule>color.text.secondary 사용</rule>
              </row>
              <row>
                <item>Error.size</item>
                <value>`12px`</value>
                <useCase>오류문구</useCase>
                <rule>color.danger.600 사용</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="B) 상태">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Input/상태/default</item>
                <value>bg `#FFFFFF`, border `#E2E8F0`, text `#0F172A`, placeholder `#94A3B8`</value>
                <useCase>기본</useCase>
                <rule>placeholder는 힌트만(값처럼 보이게 금지)</rule>
              </row>
              <row>
                <item>Input/상태/hover</item>
                <value>border `#CBD5E1`</value>
                <useCase>PC</useCase>
                <rule>hover는 border만 변경</rule>
              </row>
              <row>
                <item>Input/상태/active</item>
                <value>border `#CBD5E1`</value>
                <useCase>클릭 직후</useCase>
                <rule>active는 시각 변화 최소(깜빡임 금지)</rule>
              </row>
              <row>
                <item>Input/상태/focus</item>
                <value>border `#2563EB`, ring `2px #DBEAFE`</value>
                <useCase>입력 중</useCase>
                <rule>첫 에러 필드로 자동 스크롤/포커스(제출 시)</rule>
              </row>
              <row>
                <item>Input/상태/disabled</item>
                <value>bg `#F1F5F9`, text `#64748B`, border `#E2E8F0`</value>
                <useCase>비활성</useCase>
                <rule>잠긴 값은 “읽기 전용(Readonly)”와 구분(색/아이콘)</rule>
              </row>
              <row>
                <item>Input/상태/loading</item>
                <value>suffix spinner `16px`, delay `200ms`</value>
                <useCase>자동조회</useCase>
                <rule>200ms 미만 작업은 로딩 표시 생략</rule>
              </row>
              <row>
                <item>Input/상태/error</item>
                <value>border `#DC2626`, ring `2px #FECACA`, error text `#DC2626`</value>
                <useCase>검증 실패</useCase>
                <rule>에러 문구는 구체적으로(무엇/어떻게)</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="C) 통화 입력(다통화 필수)">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Currency.prefix.width</item>
                <value>`64px`</value>
                <useCase>통화코드</useCase>
                <rule>`KRW/THB/VND/LAK` 고정폭, 변경은 드롭다운</rule>
              </row>
              <row>
                <item>Currency.decimals</item>
                <value>`KRW=0, THB=2, VND=0, LAK=0`</value>
                <useCase>금액 표시</useCase>
                <rule>반올림 규칙은 일관(리포트/정산 동일)</rule>
              </row>
              <row>
                <item>Currency.format</item>
                <value>`1,234.56 THB`</value>
                <useCase>테이블/요약</useCase>
                <rule>통화코드 항상 노출(기호만 금지)</rule>
              </row>
            </rows>
          </table>
          <divider />
        </section>
      </section>
      <section level="3" title="Textarea" id="3-3">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>Textarea.minHeight</item>
              <value>`96px`</value>
              <useCase>사유/특이사항</useCase>
              <rule>기본 3~5줄</rule>
            </row>
            <row>
              <item>Textarea.padding</item>
              <value>`12px`</value>
              <useCase>전 영역</useCase>
              <rule>Input과 동일</rule>
            </row>
            <row>
              <item>Textarea/상태/default</item>
              <value>bg `#FFFFFF`, border `#E2E8F0`</value>
              <useCase>기본</useCase>
              <rule />
            </row>
            <row>
              <item>Textarea/상태/hover</item>
              <value>border `#CBD5E1`</value>
              <useCase>PC</useCase>
              <rule />
            </row>
            <row>
              <item>Textarea/상태/active</item>
              <value>border `#CBD5E1`</value>
              <useCase>클릭</useCase>
              <rule />
            </row>
            <row>
              <item>Textarea/상태/focus</item>
              <value>border `#2563EB`, ring `2px #DBEAFE`</value>
              <useCase>입력 중</useCase>
              <rule />
            </row>
            <row>
              <item>Textarea/상태/disabled</item>
              <value>bg `#F1F5F9`, text `#64748B`</value>
              <useCase>비활성</useCase>
              <rule />
            </row>
            <row>
              <item>Textarea/상태/loading</item>
              <value>spinner `16px`(선택)</value>
              <useCase>AI 요약/자동작성</useCase>
              <rule>로딩 중 편집 잠금</rule>
            </row>
            <row>
              <item>Textarea/상태/error</item>
              <value>border `#DC2626`, ring `2px #FECACA`</value>
              <useCase>검증 실패</useCase>
              <rule>글자수/금칙어 규칙도 동일 표기</rule>
            </row>
          </rows>
        </table>
        <divider />
      </section>
      <section level="3" title="Card" id="3-4">
        <section level="4" title="A) 기본 규격">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Card.padding</item>
                <value>`16px`</value>
                <useCase>기본 카드</useCase>
                <rule>정보 묶음/섹션</rule>
              </row>
              <row>
                <item>Card.radius</item>
                <value>`12px`</value>
                <useCase>카드</useCase>
                <rule>radius.lg</rule>
              </row>
              <row>
                <item>Card.border</item>
                <value>`1px #E2E8F0`</value>
                <useCase>기본</useCase>
                <rule>표면 구분</rule>
              </row>
              <row>
                <item>Card.title.size</item>
                <value>`16px`</value>
                <useCase>카드 타이틀</useCase>
                <rule>weight 600 금지(500 권장)</rule>
              </row>
              <row>
                <item>Card.gap</item>
                <value>`12px`</value>
                <useCase>내부 간격</useCase>
                <rule>요소 간격 고정</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="B) 상태">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Card/상태/default</item>
                <value>bg `#FFFFFF`, shadow `none`</value>
                <useCase>기본</useCase>
                <rule>클릭 가능 여부는 커서/chevron으로 표현</rule>
              </row>
              <row>
                <item>Card/상태/hover</item>
                <value>shadow `0px 1px 2px 0px #0F172A0F`, border `#CBD5E1`</value>
                <useCase>PC</useCase>
                <rule>hover로 이동/확대 금지</rule>
              </row>
              <row>
                <item>Card/상태/active</item>
                <value>border `#2563EB`</value>
                <useCase>선택</useCase>
                <rule>선택 카드에는 “선택됨” 배지</rule>
              </row>
              <row>
                <item>Card/상태/focus</item>
                <value>ring `2px #DBEAFE`</value>
                <useCase>키보드</useCase>
                <rule>카드 전체가 버튼 역할이면 role/button 준수</rule>
              </row>
              <row>
                <item>Card/상태/disabled</item>
                <value>opacity `60%`</value>
                <useCase>비활성</useCase>
                <rule>클릭/탭 불가</rule>
              </row>
              <row>
                <item>Card/상태/loading</item>
                <value>skeleton `1500ms`</value>
                <useCase>로딩</useCase>
                <rule>스켈레톤은 실제 레이아웃과 동일 크기</rule>
              </row>
              <row>
                <item>Card/상태/error</item>
                <value>border `#DC2626`, bg `#FEF2F2`</value>
                <useCase>오류</useCase>
                <rule>카드 내부에 “재시도” 버튼 제공</rule>
              </row>
            </rows>
          </table>
          <divider />
        </section>
      </section>
      <section level="3" title="Modal" id="3-5">
        <section level="4" title="A) 기본 규격">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Modal.overlay</item>
                <value>`#0F172A80`</value>
                <useCase>배경</useCase>
                <rule>클릭 시 닫힘은 위험 액션일 때 금지(기본 허용)</rule>
              </row>
              <row>
                <item>Modal.bg</item>
                <value>`#FFFFFF`</value>
                <useCase>패널</useCase>
                <rule />
              </row>
              <row>
                <item>Modal.radius</item>
                <value>`16px`</value>
                <useCase>모달</useCase>
                <rule />
              </row>
              <row>
                <item>Modal.width.sm</item>
                <value>`400px`</value>
                <useCase>단순 확인</useCase>
                <rule />
              </row>
              <row>
                <item>Modal.width.md</item>
                <value>`560px`</value>
                <useCase>기본 폼</useCase>
                <rule />
              </row>
              <row>
                <item>Modal.width.lg</item>
                <value>`720px`</value>
                <useCase>상세/비교</useCase>
                <rule />
              </row>
              <row>
                <item>Modal.padding</item>
                <value>`24px`</value>
                <useCase>내부</useCase>
                <rule>모바일은 `16px`</rule>
              </row>
              <row>
                <item>Modal.enter</item>
                <value>`200ms`</value>
                <useCase>열기</useCase>
                <rule>fade+scale(미세)</rule>
              </row>
              <row>
                <item>Modal.exit</item>
                <value>`150ms`</value>
                <useCase>닫기</useCase>
                <rule>fade</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="B) 상태">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Modal/상태/default</item>
                <value>open enter `200ms`</value>
                <useCase>기본</useCase>
                <rule>오픈 시 첫 포커스=닫기 버튼 또는 첫 입력</rule>
              </row>
              <row>
                <item>Modal/상태/hover</item>
                <value>close icon hover bg `#F1F5F9`</value>
                <useCase>PC</useCase>
                <rule>닫기 버튼은 항상 보이게</rule>
              </row>
              <row>
                <item>Modal/상태/active</item>
                <value>close active bg `#E2E8F0`</value>
                <useCase>클릭</useCase>
                <rule />
              </row>
              <row>
                <item>Modal/상태/focus</item>
                <value>focus trap `true`</value>
                <useCase>키보드</useCase>
                <rule>Tab 순환, ESC 닫기(파괴적 액션 제외)</rule>
              </row>
              <row>
                <item>Modal/상태/disabled</item>
                <value>action buttons disabled</value>
                <useCase>승인/전송 중</useCase>
                <rule>진행 중 닫기 제한(선택)</rule>
              </row>
              <row>
                <item>Modal/상태/loading</item>
                <value>skeleton `1500ms`</value>
                <useCase>데이터 로딩</useCase>
                <rule>로딩이 길면 “취소” 허용</rule>
              </row>
              <row>
                <item>Modal/상태/error</item>
                <value>error panel bg `#FEF2F2`, retry btn</value>
                <useCase>API 실패</useCase>
                <rule>에러는 원인+재시도+문의 경로</rule>
              </row>
            </rows>
          </table>
          <divider />
        </section>
      </section>
      <section level="3" title="Drawer" id="3-6">
        <section level="4" title="A) 기본 규격">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Drawer.width.sm</item>
                <value>`360px`</value>
                <useCase>상세 보기</useCase>
                <rule>우측 슬라이드</rule>
              </row>
              <row>
                <item>Drawer.width.md</item>
                <value>`480px`</value>
                <useCase>편집 폼</useCase>
                <rule />
              </row>
              <row>
                <item>Drawer.width.lg</item>
                <value>`640px`</value>
                <useCase>비교/이력</useCase>
                <rule />
              </row>
              <row>
                <item>Drawer.overlay</item>
                <value>`#0F172A80`</value>
                <useCase>배경</useCase>
                <rule />
              </row>
              <row>
                <item>Drawer.padding</item>
                <value>`20px`</value>
                <useCase>내부</useCase>
                <rule>모바일은 `16px`</rule>
              </row>
              <row>
                <item>Drawer.enter</item>
                <value>`300ms`</value>
                <useCase>열기</useCase>
                <rule>slide-in</rule>
              </row>
              <row>
                <item>Drawer.exit</item>
                <value>`200ms`</value>
                <useCase>닫기</useCase>
                <rule>slide-out</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="B) 상태">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Drawer/상태/default</item>
                <value>open enter `300ms`</value>
                <useCase>기본</useCase>
                <rule>“상세→편집”은 Drawer 우선(모달 남발 금지)</rule>
              </row>
              <row>
                <item>Drawer/상태/hover</item>
                <value>close hover bg `#F1F5F9`</value>
                <useCase>PC</useCase>
                <rule />
              </row>
              <row>
                <item>Drawer/상태/active</item>
                <value>close active bg `#E2E8F0`</value>
                <useCase>클릭</useCase>
                <rule />
              </row>
              <row>
                <item>Drawer/상태/focus</item>
                <value>focus trap `true`</value>
                <useCase>키보드</useCase>
                <rule>ESC 닫기(필요 시 차단)</rule>
              </row>
              <row>
                <item>Drawer/상태/disabled</item>
                <value>action disabled</value>
                <useCase>처리 중</useCase>
                <rule />
              </row>
              <row>
                <item>Drawer/상태/loading</item>
                <value>skeleton `1500ms`</value>
                <useCase>로딩</useCase>
                <rule />
              </row>
              <row>
                <item>Drawer/상태/error</item>
                <value>error panel bg `#FEF2F2`</value>
                <useCase>오류</useCase>
                <rule>재시도/로그ID 표시</rule>
              </row>
            </rows>
          </table>
          <divider />
        </section>
      </section>
      <section level="3" title="Toast (In-app)" id="3-7">
        <section level="4" title="A) 기본 규격">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Toast.width.max</item>
                <value>`360px`</value>
                <useCase>PC</useCase>
                <rule>긴 문구는 2줄 제한</rule>
              </row>
              <row>
                <item>Toast.padding</item>
                <value>`12px 14px`</value>
                <useCase>공통</useCase>
                <rule />
              </row>
              <row>
                <item>Toast.radius</item>
                <value>`12px`</value>
                <useCase>공통</useCase>
                <rule />
              </row>
              <row>
                <item>Toast.shadow</item>
                <value>`0px 8px 20px -8px #0F172A2E`</value>
                <useCase>공통</useCase>
                <rule />
              </row>
              <row>
                <item>Toast.enter</item>
                <value>`200ms`</value>
                <useCase>표시</useCase>
                <rule>slide+fade</rule>
              </row>
              <row>
                <item>Toast.duration.base</item>
                <value>`4000ms`</value>
                <useCase>info/success</useCase>
                <rule>자동 닫힘</rule>
              </row>
              <row>
                <item>Toast.duration.error</item>
                <value>`6000ms`</value>
                <useCase>error</useCase>
                <rule>자동 닫힘(길게)</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="B) 상태">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Toast/상태/default</item>
                <value>bg `#FFFFFF`, border `#E2E8F0`</value>
                <useCase>기본</useCase>
                <rule>한 번에 최대 3개(스택)</rule>
              </row>
              <row>
                <item>Toast/상태/hover</item>
                <value>timer pause `true`</value>
                <useCase>마우스</useCase>
                <rule>hover 시 자동닫힘 일시정지</rule>
              </row>
              <row>
                <item>Toast/상태/active</item>
                <value>action click</value>
                <useCase>“되돌리기”</useCase>
                <rule>액션은 1개만(복잡 금지)</rule>
              </row>
              <row>
                <item>Toast/상태/focus</item>
                <value>focusable close btn</value>
                <useCase>키보드</useCase>
                <rule>aria-live 적용(아래 A11y)</rule>
              </row>
              <row>
                <item>Toast/상태/disabled</item>
                <value>action disabled</value>
                <useCase>처리 중</useCase>
                <rule />
              </row>
              <row>
                <item>Toast/상태/loading</item>
                <value>progress bar `200ms`(선택)</value>
                <useCase>업로드 등</useCase>
                <rule>진행률 표시 가능하면 제공</rule>
              </row>
              <row>
                <item>Toast/상태/error</item>
                <value>left accent `#DC2626`</value>
                <useCase>오류</useCase>
                <rule>오류는 원인+다음 행동(재시도/문의) 포함</rule>
              </row>
            </rows>
          </table>
          <divider />
        </section>
      </section>
      <section level="3" title="Table (리스트/리포트 핵심)" id="3-8">
        <section level="4" title="A) 기본 규격">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Table.header.height</item>
                <value>`44px`</value>
                <useCase>헤더</useCase>
                <rule>sticky 가능</rule>
              </row>
              <row>
                <item>Table.row.height.dense</item>
                <value>`44px`</value>
                <useCase>기본 리스트</useCase>
                <rule>관리자 기본(정보 밀도)</rule>
              </row>
              <row>
                <item>Table.row.height.comfy</item>
                <value>`52px`</value>
                <useCase>모바일/중요</useCase>
                <rule>가독성 우선</rule>
              </row>
              <row>
                <item>Table.cell.padding</item>
                <value>`12px 16px`</value>
                <useCase>셀</useCase>
                <rule>숫자/통화는 우측 정렬</rule>
              </row>
              <row>
                <item>Table.border</item>
                <value>`1px #E2E8F0`</value>
                <useCase>외곽</useCase>
                <rule />
              </row>
              <row>
                <item>Table.header.bg</item>
                <value>`#F8FAFC`</value>
                <useCase>헤더</useCase>
                <rule>헤더는 항상 대비 확보</rule>
              </row>
              <row>
                <item>Table.row.hover.bg</item>
                <value>`#F8FAFC`</value>
                <useCase>hover</useCase>
                <rule />
              </row>
              <row>
                <item>Table.row.selected.bg</item>
                <value>`#DBEAFE`</value>
                <useCase>선택</useCase>
                <rule>선택은 색+체크 아이콘 병행</rule>
              </row>
              <row>
                <item>Table.pagination.height</item>
                <value>`56px`</value>
                <useCase>하단</useCase>
                <rule>페이지네이션 고정</rule>
              </row>
            </rows>
          </table>
        </section>
        <section level="4" title="B) 상태">
          <table>
            <columns>
              <column tag="item" label="항목" />
              <column tag="value" label="값(HEX·px·ms)" />
              <column tag="useCase" label="사용처" />
              <column tag="rule" label="규칙" />
            </columns>
            <rows>
              <row>
                <item>Table/상태/default</item>
                <value>row bg `#FFFFFF`</value>
                <useCase>기본</useCase>
                <rule>정렬/필터 상태는 상단에 칩으로 노출</rule>
              </row>
              <row>
                <item>Table/상태/hover</item>
                <value>row bg `#F8FAFC`</value>
                <useCase>PC</useCase>
                <rule>행 전체 hover(셀별 hover 금지)</rule>
              </row>
              <row>
                <item>Table/상태/active</item>
                <value>selected bg `#DBEAFE`, left bar `#2563EB`</value>
                <useCase>선택</useCase>
                <rule>선택 행의 핵심 액션(상세/승인) 노출</rule>
              </row>
              <row>
                <item>Table/상태/focus</item>
                <value>cell outline `2px #DBEAFE`</value>
                <useCase>키보드</useCase>
                <rule>방향키 이동은 선택(툴 지원 시)</rule>
              </row>
              <row>
                <item>Table/상태/disabled</item>
                <value>opacity `60%`</value>
                <useCase>잠금 행</useCase>
                <rule>Locked 상태는 행 액션 비활성</rule>
              </row>
              <row>
                <item>Table/상태/loading</item>
                <value>skeleton rows `1500ms`</value>
                <useCase>로딩</useCase>
                <rule>500행↑ 가상스크롤 권장</rule>
              </row>
              <row>
                <item>Table/상태/error</item>
                <value>empty state + retry</value>
                <useCase>실패</useCase>
                <rule>“데이터 없음”과 “오류”는 문구/아이콘 분리</rule>
              </row>
            </rows>
          </table>
          <divider />
        </section>
      </section>
    </section>
    <section level="2" title="핵심 UX 규칙(업무 흐름 기준)" id="4">
      <section level="3" title="폼/검증(견적·정산 공통)" id="4-1">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>검증 트리거</item>
              <value>onBlur + onSubmit</value>
              <useCase>입력 폼</useCase>
              <rule>제출 시 첫 오류 필드로 자동 이동</rule>
            </row>
            <row>
              <item>필수값 표시</item>
              <value>`*` color `#DC2626`</value>
              <useCase>라벨</useCase>
              <rule>필수/선택 명확히 구분</rule>
            </row>
            <row>
              <item>마이너스/마진 미달</item>
              <value>warning `#D97706`</value>
              <useCase>견적</useCase>
              <rule>계산 불가(차단) vs 경고(승인 필요) 구분</rule>
            </row>
            <row>
              <item>자동계산 표시</item>
              <value>badge bg `#F1F5F9`</value>
              <useCase>계산 필드</useCase>
              <rule>“자동 계산”은 읽기 전용으로 표현</rule>
            </row>
            <row>
              <item>임시저장</item>
              <value>autosave `2000ms` debounce</value>
              <useCase>긴 입력</useCase>
              <rule>저장 상태(저장됨/저장 중/실패) 상단 표시</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="승인 플로우 UI(담당→소장→대표)" id="4-2">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>상태 Badge</item>
              <value>Approved `#16A34A`, Rejected `#DC2626`, InReview `#0891B2`, Draft `#64748B`</value>
              <useCase>상세/리스트</useCase>
              <rule>상태는 제목 옆 + 리스트 컬럼에 항상 표시</rule>
            </row>
            <row>
              <item>승인 버튼 잠금</item>
              <value>disabled style 적용</value>
              <useCase>승인 전 출력</useCase>
              <rule>Approved 전에는 PDF/엑셀 “다운로드/외부전송” 비활성</rule>
            </row>
            <row>
              <item>변경 이력</item>
              <value>Table row height `44px`</value>
              <useCase>이력 탭</useCase>
              <rule>누가/언제/무엇(필드) 변경했는지 필수</rule>
            </row>
            <row>
              <item>반려 사유</item>
              <value>Textarea min `96px`</value>
              <useCase>Rejected</useCase>
              <rule>반려는 사유 필수, 템플릿 문구 제공</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="인스펙션 미디어(사진/영상) 연결 UX" id="4-3">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>미디어 썸네일</item>
              <value>`96px` 정사각</value>
              <useCase>라이브러리</useCase>
              <rule>Lazy load, 클릭 시 Drawer 상세</rule>
            </row>
            <row>
              <item>선택 인디케이터</item>
              <value>ring `2px #DBEAFE`</value>
              <useCase>선택</useCase>
              <rule>색만으로 선택 표시 금지(체크 병행)</rule>
            </row>
            <row>
              <item>영상 표기</item>
              <value>play icon `16px` + QR</value>
              <useCase>PDF</useCase>
              <rule>PDF에는 링크/QR만(인라인 재생 금지)</rule>
            </row>
            <row>
              <item>PDF 미리보기</item>
              <value>A4 `794×1123px`</value>
              <useCase>견적 출력</useCase>
              <rule>페이지 분리 규칙 고정(이미지 잘림 금지)</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="다국어 UI(문구 세트) 규칙" id="4-4">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>언어 토글 위치</item>
              <value>Topbar 우측</value>
              <useCase>전 화면</useCase>
              <rule>KR/TH/VI/LO 고정, 사용자 프로필에 기본값 저장</rule>
            </row>
            <row>
              <item>텍스트 확장 대비</item>
              <value>여유 `30%`</value>
              <useCase>버튼/라벨</useCase>
              <rule>고정폭 버튼 금지(아이콘+툴팁 대체)</rule>
            </row>
            <row>
              <item>날짜/숫자 로캘</item>
              <value>locale 기반</value>
              <useCase>리포트/금액</useCase>
              <rule>언어와 로캘 분리 가능(운영 규칙에 따름)</rule>
            </row>
          </rows>
        </table>
      </section>
      <section level="3" title="다통화/환율 UX" id="4-5">
        <table>
          <columns>
            <column tag="item" label="항목" />
            <column tag="value" label="값(HEX·px·ms)" />
            <column tag="useCase" label="사용처" />
            <column tag="rule" label="규칙" />
          </columns>
          <rows>
            <row>
              <item>기준 통화 표시</item>
              <value>badge bg `#F1F5F9`</value>
              <useCase>요약 카드</useCase>
              <rule>“기준통화: KRW” 항상 노출</rule>
            </row>
            <row>
              <item>환율 변경 경고</item>
              <value>warning `#D97706`</value>
              <useCase>설정</useCase>
              <rule>환율 변경 시 영향 범위(견적/정산/리포트) 안내 후 적용</rule>
            </row>
            <row>
              <item>자동 재계산</item>
              <value>loading `200ms`</value>
              <useCase>금액 영역</useCase>
              <rule>재계산 중 잠금 + 완료 토스트</rule>
            </row>
          </rows>
        </table>
        <divider />
      </section>
    </section>
    <section level="2" title="접근성(A11y) 체크리스트" id="5">
      <table>
        <columns>
          <column tag="item" label="항목" />
          <column tag="value" label="값(HEX·px·ms)" />
          <column tag="useCase" label="사용처" />
          <column tag="rule" label="규칙" />
        </columns>
        <rows>
          <row>
            <item>대비(텍스트)</item>
            <value>`4.5:1` 이상</value>
            <useCase>전 화면</useCase>
            <rule>캡션도 동일 기준(예외 금지)</rule>
          </row>
          <row>
            <item>포커스 링</item>
            <value>`2px #DBEAFE`</value>
            <useCase>인터랙션</useCase>
            <rule>focus 숨김 금지, 키보드 탐색 가능</rule>
          </row>
          <row>
            <item>터치 타겟</item>
            <value>`44×44px`</value>
            <useCase>모바일</useCase>
            <rule>아이콘 버튼/체크박스 포함</rule>
          </row>
          <row>
            <item>라벨 연결</item>
            <value>label + for</value>
            <useCase>입력</useCase>
            <rule>아이콘-only 버튼은 aria-label 필수</rule>
          </row>
          <row>
            <item>에러 안내</item>
            <value>인라인 + 요약</value>
            <useCase>폼</useCase>
            <rule>에러는 색만으로 표시 금지(문구+아이콘)</rule>
          </row>
          <row>
            <item>모달/드로어</item>
            <value>focus trap</value>
            <useCase>레이어</useCase>
            <rule>ESC 닫기, 초기 포커스 지정</rule>
          </row>
          <row>
            <item>토스트</item>
            <value>aria-live</value>
            <useCase>알림</useCase>
            <rule>info=polite, error=assertive 권장</rule>
          </row>
          <row>
            <item>테이블</item>
            <value>header scope</value>
            <useCase>목록</useCase>
            <rule>정렬 상태를 텍스트로도 노출</rule>
          </row>
        </rows>
      </table>
      <divider />
    </section>
    <section level="2" title="UI QA 체크리스트(수용 기준)" id="6">
      <table>
        <columns>
          <column tag="item" label="항목" />
          <column tag="value" label="값(HEX·px·ms)" />
          <column tag="useCase" label="사용처" />
          <column tag="rule" label="규칙" />
        </columns>
        <rows>
          <row>
            <item>반응형 점검</item>
            <value>`360/768/1024/1440px`</value>
            <useCase>전 화면</useCase>
            <rule>가로 스크롤(불가피한 표 제외) 금지</rule>
          </row>
          <row>
            <item>상태 점검</item>
            <value>`default/hover/active/focus/disabled/loading/error`</value>
            <useCase>필수 컴포넌트</useCase>
            <rule>모든 상태 스타일/동작 확인</rule>
          </row>
          <row>
            <item>승인 차단</item>
            <value>Approved 전 출력 불가</value>
            <useCase>견적/정산</useCase>
            <rule>다운로드/외부전송 버튼 비활성 확인</rule>
          </row>
          <row>
            <item>다국어</item>
            <value>KR/TH/VI/LO</value>
            <useCase>전 화면</useCase>
            <rule>라벨 overflow/줄바꿈/툴팁 확인</rule>
          </row>
          <row>
            <item>다통화</item>
            <value>KRW/THB/VND/LAK</value>
            <useCase>금액</useCase>
            <rule>반올림/표기/환율 변경 재계산 확인</rule>
          </row>
          <row>
            <item>대용량 성능</item>
            <value>500행↑</value>
            <useCase>테이블</useCase>
            <rule>로딩/가상스크롤/필터 지연 확인</rule>
          </row>
          <row>
            <item>미디어</item>
            <value>이미지/영상 링크</value>
            <useCase>PDF</useCase>
            <rule>썸네일/QR/링크 동작 및 파일명 규칙 확인</rule>
          </row>
          <row>
            <item>오류 처리</item>
            <value>API 실패</value>
            <useCase>전 화면</useCase>
            <rule>에러 상태 화면 + 재시도 + 로그ID 노출</rule>
          </row>
        </rows>
      </table>
      <divider />
    </section>
    <section level="2" title="가정(Assumptions)" id="7">
      <table>
        <columns>
          <column tag="item" label="항목" />
          <column tag="value" label="값(HEX·px·ms)" />
          <column tag="useCase" label="사용처" />
          <column tag="rule" label="규칙" />
        </columns>
        <rows>
          <row>
            <item>브랜드 컬러/폰트 가이드 부재</item>
            <value>Primary `#2563EB`, Noto Sans 계열</value>
            <useCase>전 화면</useCase>
            <rule>발주사 브랜드 가이드 제공 시 color/token만 교체</rule>
          </row>
          <row>
            <item>다크모드 범위 제외</item>
            <value>Light only</value>
            <useCase>전 화면</useCase>
            <rule>토큰 구조는 확장 가능하게 유지</rule>
          </row>
          <row>
            <item>아이콘 세트</item>
            <value>24px 그리드(예: Lucide 계열)</value>
            <useCase>전 화면</useCase>
            <rule>로우코드 내장 아이콘 사용 시 크기/선 굵기 일관 유지</rule>
          </row>
          <row>
            <item>PDF 생성 방식</item>
            <value>HTML→PDF(가정)</value>
            <useCase>견적</useCase>
            <rule>A4 기준 `794×1123px`로 레이아웃 고정</rule>
          </row>
          <row>
            <item>시간대 표기</item>
            <value>행사 지역 기준(가정)</value>
            <useCase>일정/배정</useCase>
            <rule>설정에서 “기본 시간대” 변경 가능하도록 설계</rule>
          </row>
        </rows>
      </table>
    </section>
  </body>
</uiUxSpecDocument>
```
