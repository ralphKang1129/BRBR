import { format } from 'date-fns';

// 코트 타입 정의
export interface Court {
  id: string;
  name: string;
  location: string;
  address: string;
  price: number;
  description: string;
  availableTime: string;
  facilities: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

// 예약 타입 정의
export interface Booking {
  id: string;
  courtId: string;
  date: string;
  startHour: number;
  endHour: number;
  userName: string;
}

// 내 예약 타입 정의
export interface MyBooking {
  id: string;
  courtId: string;
  courtName: string;
  courtLocation: string;
  courtImageUrl: string;
  gymName: string;
  date: string;
  startHour: number;
  endHour: number;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  paymentMethod?: string; // 결제 수단 (카드, 카카오페이 등)
  paymentId?: string;     // 결제 고유 ID
}

// 시간 슬롯 타입 정의
export interface TimeSlot {
  date: Date;
  hour: number;
}

// 선택된 시간 범위 타입 정의
export interface SelectedTimeRange {
  startDate: Date;
  startHour: number;
  endDate: Date;
  endHour: number;
}

// 결제 방법 타입 정의
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// 코트 목록 (더미 데이터)
export const MOCK_COURTS: Court[] = [
  {
    id: '1',
    name: '강남 배드민턴 센터',
    location: '강남구',
    address: '서울 강남구 강남대로 123',
    price: 15000,
    description: '쾌적한 환경의 실내 배드민턴 코트',
    availableTime: '06:00 - 23:00',
    facilities: ['샤워실', '주차장', '락커룸', '휴게실'],
    rating: 4.5,
    reviewCount: 128,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: '서초 스포츠 센터',
    location: '서초구',
    address: '서울 서초구 서초대로 456',
    price: 18000,
    description: '프리미엄 배드민턴 코트',
    availableTime: '07:00 - 22:00',
    facilities: ['샤워실', '락커룸', '카페', '무료 주차장'],
    rating: 4.7,
    reviewCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: '송파 배드민턴 아카데미',
    location: '송파구',
    address: '서울 송파구 올림픽로 789',
    price: 22000,
    description: '최고급 시설의 배드민턴 전용 코트',
    availableTime: '08:00 - 24:00',
    facilities: ['샤워실', '주차장', '락커룸', '수건 제공', '코치 서비스'],
    rating: 4.9,
    reviewCount: 213,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

// 예약 목록 (더미 데이터)
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    courtId: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    startHour: 10,
    endHour: 12,
    userName: '김철수'
  },
  {
    id: '2',
    courtId: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    startHour: 15,
    endHour: 16,
    userName: '이영희'
  },
  {
    id: '3',
    courtId: '2',
    date: format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'),
    startHour: 18,
    endHour: 19,
    userName: '박민준'
  }
];

// 결제 수단 목록
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', name: '신용/체크카드', icon: '💳' },
  { id: 'kakao', name: '카카오페이', icon: '🟨' },
  { id: 'naver', name: '네이버페이', icon: '🟩' },
  { id: 'payco', name: '페이코', icon: '🟥' },
  { id: 'toss', name: '토스', icon: '🔵' },
];

// 내 예약 목록 (더미 데이터)
export let MOCK_MY_BOOKINGS: MyBooking[] = [
  {
    id: '1001',
    courtId: '1',
    courtName: '메인 코트 A',
    courtLocation: '서울시 강남구 역삼동',
    courtImageUrl: 'https://source.unsplash.com/random/800x600/?badminton',
    gymName: '역삼 배드민턴장',
    date: '2023-11-15',
    startHour: 14,
    endHour: 16,
    price: 30000,
    status: 'confirmed',
    createdAt: '2023-11-10',
    paymentMethod: 'card',
    paymentId: 'pay_12345678'
  },
  {
    id: '1002',
    courtId: '2',
    courtName: '전문가 코트 B',
    courtLocation: '서울시 서초구 방배동',
    courtImageUrl: 'https://source.unsplash.com/random/800x600/?sports',
    gymName: '방배 스포츠 센터',
    date: '2023-11-18',
    startHour: 19,
    endHour: 21,
    price: 40000,
    status: 'pending',
    createdAt: '2023-11-12',
    paymentMethod: 'kakao',
    paymentId: 'pay_23456789'
  },
  {
    id: '1003',
    courtId: '3',
    courtName: '일반 코트 C',
    courtLocation: '서울시 송파구 잠실동',
    courtImageUrl: 'https://source.unsplash.com/random/800x600/?court',
    gymName: '잠실 체육관',
    date: '2023-11-20',
    startHour: 10,
    endHour: 12,
    price: 25000,
    status: 'cancelled',
    createdAt: '2023-11-08',
    paymentMethod: 'toss',
    paymentId: 'pay_34567890'
  }
];

// 새 예약 저장 함수
export const saveBooking = (
  courtId: string,
  selectedRanges: SelectedTimeRange[],
  paymentMethod: string
): MyBooking[] => {
  // 예약하려는 코트 정보 찾기
  const court = MOCK_COURTS.find(c => c.id === courtId);
  if (!court) {
    throw new Error('코트 정보를 찾을 수 없습니다.');
  }

  // 선택한 범위에 대해 예약 생성
  const newBookings: MyBooking[] = selectedRanges.map((range, index) => {
    const totalHours = range.endHour - range.startHour;
    const price = totalHours * court.price;
    const bookingDate = format(range.startDate, 'yyyy-MM-dd');
    
    // 기존 예약 목록에 추가할 새 예약
    const newBooking: MyBooking = {
      id: 'new_' + Date.now().toString() + '_' + index,
      courtId: court.id,
      courtName: court.name,
      courtLocation: court.location,
      courtImageUrl: court.imageUrl,
      gymName: '역삼 배드민턴장',
      date: bookingDate,
      startHour: range.startHour,
      endHour: range.endHour,
      price: price,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentMethod: paymentMethod,
      paymentId: 'pay_' + Math.random().toString(36).substring(2, 15)
    };
    
    // MOCK_BOOKINGS에도 추가
    MOCK_BOOKINGS.push({
      id: newBooking.id,
      courtId: court.id,
      date: bookingDate,
      startHour: range.startHour,
      endHour: range.endHour,
      userName: '사용자'
    });
    
    // MOCK_MY_BOOKINGS에도 추가
    MOCK_MY_BOOKINGS.push(newBooking);
    
    return newBooking;
  });
  
  return newBookings;
}; 