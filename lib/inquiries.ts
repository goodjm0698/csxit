export type Channel = "naver" | "coupang" | "kakao"
export type Status = "new" | "progress" | "waiting" | "complete"

export interface PurchaseItem {
  id: number
  name: string
  date: string
  price: string
}

export interface ConsultItem {
  id: number
  date: string
  subject: string
  status: string
}

export interface ConversationItem {
  id: number
  type: "customer" | "system"
  time: string
  message: string
  name?: string
}

export interface Inquiry {
  id: string
  channel: Channel
  customerName: string
  title: string
  status: Status
  elapsedTime: string
  category: string
  productName: string
  orderNumber: string
  ticketNumber: string
  waitTime: string
  customerInitial: string
  customerTier: string
  memberId: string
  phone: string
  email: string
  joinedAt: string
  totalSpent: string
  totalOrders: number
  purchaseHistory: PurchaseItem[]
  consultHistory: ConsultItem[]
  conversation: ConversationItem[]
  aiDraft: string
}

export const inquiries: Inquiry[] = [
  {
    id: "1",
    channel: "naver",
    customerName: "김민수",
    title: "배송 지연 문의드립니다",
    status: "new",
    elapsedTime: "5분 전",
    category: "배송문의",
    productName: "프리미엄 무선 이어폰 Pro",
    orderNumber: "ORD-20260427-1001",
    ticketNumber: "TK-20260427-0001",
    waitTime: "5분",
    customerInitial: "김",
    customerTier: "VIP",
    memberId: "M-2021-04523",
    phone: "010-****-1123",
    email: "kim***@email.com",
    joinedAt: "2021.04.15",
    totalSpent: "1,316,000원",
    totalOrders: 12,
    purchaseHistory: [
      { id: 1, name: "프리미엄 무선 이어폰 Pro", date: "2026.04.20", price: "299,000원" },
      { id: 2, name: "무선 충전 스탠드", date: "2026.03.11", price: "79,000원" },
      { id: 3, name: "노이즈캔슬링 헤드폰", date: "2026.01.24", price: "389,000원" },
    ],
    consultHistory: [
      { id: 1, date: "2026.04.21", subject: "배송 일정 확인 요청", status: "완료" },
      { id: 2, date: "2026.02.13", subject: "제품 교환 문의", status: "완료" },
    ],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "김민수",
        time: "오늘 14:23",
        message:
          "안녕하세요, 지난주에 주문한 프리미엄 무선 이어폰 Pro 배송이 아직 시작되지 않았어요. 주문번호는 ORD-20260427-1001인데 언제 받아볼 수 있을까요?",
      },
      {
        id: 2,
        type: "system",
        time: "오늘 14:24",
        message: "티켓이 김상담 상담원에게 배정되었습니다.",
      },
    ],
    aiDraft: `안녕하세요, 김민수 고객님. 주문하신 프리미엄 무선 이어폰 Pro 배송 건을 확인했습니다.

현재 물류센터 출고 대기 상태이며, 내일 오전 중 발송 예정입니다. 기다리시게 해드려 죄송합니다.

발송이 시작되는 즉시 알림 메시지를 보내드리겠습니다. 추가 문의가 있으시면 언제든지 말씀해주세요.`,
  },
  {
    id: "2",
    channel: "coupang",
    customerName: "이영희",
    title: "교환/반품 요청",
    status: "progress",
    elapsedTime: "15분 전",
    category: "교환문의",
    productName: "스마트워치 울트라",
    orderNumber: "ORD-20260427-1002",
    ticketNumber: "TK-20260427-0002",
    waitTime: "15분",
    customerInitial: "이",
    customerTier: "일반",
    memberId: "M-2023-01812",
    phone: "010-****-4471",
    email: "lee***@email.com",
    joinedAt: "2023.01.09",
    totalSpent: "548,000원",
    totalOrders: 4,
    purchaseHistory: [
      { id: 1, name: "스마트워치 울트라", date: "2026.04.25", price: "549,000원" },
      { id: 2, name: "워치 스트랩", date: "2026.04.02", price: "49,000원" },
    ],
    consultHistory: [{ id: 1, date: "2026.04.10", subject: "사이즈 문의", status: "완료" }],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "이영희",
        time: "오늘 14:10",
        message:
          "받아보니 색상이 생각과 달라서 교환이나 반품이 가능한지 문의드립니다. 포장은 뜯었지만 사용은 하지 않았습니다.",
      },
      {
        id: 2,
        type: "system",
        time: "오늘 14:12",
        message: "교환/반품 정책이 자동으로 불러와졌습니다.",
      },
    ],
    aiDraft: `안녕하세요, 이영희 고객님. 제품 상태를 확인해주셔서 감사합니다.

사용 흔적이 없다면 수령 후 7일 이내 교환 또는 반품 접수가 가능합니다. 포장 상태를 유지하신 채 회수 신청을 도와드리겠습니다.

원하시는 진행 방향을 알려주시면 바로 안내 이어가겠습니다.`,
  },
  {
    id: "3",
    channel: "kakao",
    customerName: "박철수",
    title: "제품 사용법 문의",
    status: "waiting",
    elapsedTime: "30분 전",
    category: "사용문의",
    productName: "노이즈캔슬링 헤드폰",
    orderNumber: "ORD-20260427-1003",
    ticketNumber: "TK-20260427-0003",
    waitTime: "30분",
    customerInitial: "박",
    customerTier: "VIP",
    memberId: "M-2020-00891",
    phone: "010-****-2901",
    email: "park***@email.com",
    joinedAt: "2020.08.02",
    totalSpent: "2,104,000원",
    totalOrders: 19,
    purchaseHistory: [
      { id: 1, name: "노이즈캔슬링 헤드폰", date: "2026.04.17", price: "389,000원" },
      { id: 2, name: "휴대용 케이스", date: "2026.04.17", price: "39,000원" },
    ],
    consultHistory: [
      { id: 1, date: "2026.03.08", subject: "블루투스 연결 문의", status: "완료" },
      { id: 2, date: "2026.01.29", subject: "AS 접수 방법 안내", status: "완료" },
    ],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "박철수",
        time: "오늘 13:55",
        message:
          "헤드폰 앱 연결 후 주변음 허용 모드가 어디에 있는지 잘 모르겠어요. 설정 위치를 알려주실 수 있나요?",
      },
      {
        id: 2,
        type: "system",
        time: "오늘 13:57",
        message: "도움말 문서가 추천 답변과 함께 연결되었습니다.",
      },
    ],
    aiDraft: `안녕하세요, 박철수 고객님. 문의 주신 주변음 허용 모드 설정 방법 안내드립니다.

앱 실행 후 기기 선택 > 사운드 설정 > 노이즈 제어 메뉴에서 주변음 허용 모드를 활성화하실 수 있습니다.

설정 화면이 보이지 않으면 앱 버전 업데이트 후 다시 확인 부탁드립니다.`,
  },
  {
    id: "4",
    channel: "naver",
    customerName: "정수진",
    title: "결제 오류 발생",
    status: "new",
    elapsedTime: "45분 전",
    category: "결제문의",
    productName: "프리미엄 충전 허브",
    orderNumber: "ORD-20260427-1004",
    ticketNumber: "TK-20260427-0004",
    waitTime: "45분",
    customerInitial: "정",
    customerTier: "일반",
    memberId: "M-2024-01202",
    phone: "010-****-9912",
    email: "jung***@email.com",
    joinedAt: "2024.01.12",
    totalSpent: "152,000원",
    totalOrders: 2,
    purchaseHistory: [{ id: 1, name: "프리미엄 충전 허브", date: "2026.04.27", price: "152,000원" }],
    consultHistory: [],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "정수진",
        time: "오늘 13:40",
        message:
          "결제 버튼을 누르면 계속 실패했다고 나와요. 카드 승인 문자는 왔는데 주문은 생성되지 않았습니다.",
      },
    ],
    aiDraft: `안녕하세요, 정수진 고객님. 결제 과정에서 불편을 드려 죄송합니다.

현재 승인 이력과 주문 생성 상태를 함께 확인 중이며, 중복 결제 여부까지 확인한 뒤 바로 안내드리겠습니다.

잠시만 기다려주시면 빠르게 처리해드리겠습니다.`,
  },
  {
    id: "5",
    channel: "coupang",
    customerName: "최동현",
    title: "상품 재입고 문의",
    status: "complete",
    elapsedTime: "1시간 전",
    category: "재입고문의",
    productName: "고급 이어팁 세트",
    orderNumber: "ORD-20260427-1005",
    ticketNumber: "TK-20260427-0005",
    waitTime: "응답 완료",
    customerInitial: "최",
    customerTier: "일반",
    memberId: "M-2022-02581",
    phone: "010-****-2034",
    email: "choi***@email.com",
    joinedAt: "2022.07.19",
    totalSpent: "317,000원",
    totalOrders: 5,
    purchaseHistory: [{ id: 1, name: "이어폰 케이스", date: "2026.03.19", price: "29,000원" }],
    consultHistory: [{ id: 1, date: "2026.04.01", subject: "재입고 일정 답변 완료", status: "완료" }],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "최동현",
        time: "오늘 13:20",
        message: "고급 이어팁 세트가 품절인데 다음 입고 일정이 있을까요?",
      },
      {
        id: 2,
        type: "system",
        time: "오늘 13:28",
        message: "고객에게 재입고 예정일이 전달되어 티켓이 완료되었습니다.",
      },
    ],
    aiDraft: `안녕하세요, 최동현 고객님. 문의하신 이어팁 세트는 다음 주 초 재입고 예정입니다.

재입고 알림을 원하시면 바로 등록 도와드릴 수 있습니다. 기다려주셔서 감사합니다.`,
  },
  {
    id: "6",
    channel: "kakao",
    customerName: "강미라",
    title: "환불 진행 상황",
    status: "progress",
    elapsedTime: "1시간 30분 전",
    category: "환불문의",
    productName: "스마트 조명 세트",
    orderNumber: "ORD-20260427-1006",
    ticketNumber: "TK-20260427-0006",
    waitTime: "1시간 30분",
    customerInitial: "강",
    customerTier: "일반",
    memberId: "M-2023-04120",
    phone: "010-****-7823",
    email: "kang***@email.com",
    joinedAt: "2023.11.21",
    totalSpent: "442,000원",
    totalOrders: 7,
    purchaseHistory: [{ id: 1, name: "스마트 조명 세트", date: "2026.04.01", price: "219,000원" }],
    consultHistory: [{ id: 1, date: "2026.04.20", subject: "환불 접수 완료 안내", status: "완료" }],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "강미라",
        time: "오늘 12:58",
        message: "지난주에 반품 접수한 건 환불이 언제 처리되는지 확인 부탁드려요.",
      },
    ],
    aiDraft: `안녕하세요, 강미라 고객님. 환불 진행 상황 확인해보니 현재 검수 완료 후 결제 취소 단계에 있습니다.

카드사 반영까지는 영업일 기준 2~3일 정도 소요될 수 있습니다. 반영이 완료되면 다시 안내드리겠습니다.`,
  },
  {
    id: "7",
    channel: "naver",
    customerName: "윤서연",
    title: "사이즈 교환 문의",
    status: "waiting",
    elapsedTime: "2시간 전",
    category: "교환문의",
    productName: "스마트 밴드",
    orderNumber: "ORD-20260427-1007",
    ticketNumber: "TK-20260427-0007",
    waitTime: "2시간",
    customerInitial: "윤",
    customerTier: "일반",
    memberId: "M-2024-02217",
    phone: "010-****-3108",
    email: "yoon***@email.com",
    joinedAt: "2024.05.03",
    totalSpent: "184,000원",
    totalOrders: 3,
    purchaseHistory: [{ id: 1, name: "스마트 밴드", date: "2026.04.15", price: "184,000원" }],
    consultHistory: [],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "윤서연",
        time: "오늘 12:15",
        message: "받아보니 밴드 사이즈가 조금 커서 작은 사이즈로 교환하고 싶어요.",
      },
    ],
    aiDraft: `안녕하세요, 윤서연 고객님. 사이즈 교환 요청 확인했습니다.

수령 후 7일 이내라면 교환 가능하며, 회수 접수와 재배송 일정을 함께 안내드릴 수 있습니다.`,
  },
  {
    id: "8",
    channel: "coupang",
    customerName: "장현우",
    title: "품질 불량 신고",
    status: "new",
    elapsedTime: "2시간 30분 전",
    category: "불량문의",
    productName: "멀티 충전 케이블",
    orderNumber: "ORD-20260427-1008",
    ticketNumber: "TK-20260427-0008",
    waitTime: "2시간 30분",
    customerInitial: "장",
    customerTier: "VIP",
    memberId: "M-2022-03033",
    phone: "010-****-8840",
    email: "jang***@email.com",
    joinedAt: "2022.03.16",
    totalSpent: "931,000원",
    totalOrders: 11,
    purchaseHistory: [{ id: 1, name: "멀티 충전 케이블", date: "2026.04.24", price: "49,000원" }],
    consultHistory: [{ id: 1, date: "2026.03.04", subject: "배송 문의", status: "완료" }],
    conversation: [
      {
        id: 1,
        type: "customer",
        name: "장현우",
        time: "오늘 11:48",
        message: "받은 케이블이 충전이 아예 되지 않습니다. 초기 불량 같은데 어떻게 처리되나요?",
      },
    ],
    aiDraft: `안녕하세요, 장현우 고객님. 제품 불량으로 불편을 드려 죄송합니다.

초기 불량으로 확인될 경우 즉시 무료 교환 또는 환불로 도와드릴 예정입니다. 사진을 보내주시면 더 빠르게 처리하겠습니다.`,
  },
]

export const inquiryMap = new Map(inquiries.map((inquiry) => [inquiry.id, inquiry]))
