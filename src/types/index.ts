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
  date: string;
  startHour: number;
  endHour: number;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

// 시간 슬롯 타입 정의
export interface TimeSlot {
  date: Date;
  hour: number;
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

// 내 예약 목록 (더미 데이터)
export const MOCK_MY_BOOKINGS: MyBooking[] = [
  {
    id: '1',
    courtId: '1',
    courtName: '강남 배드민턴 센터',
    courtLocation: '강남구',
    courtImageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-06-15',
    startHour: 10,
    endHour: 12,
    price: 30000,
    status: 'confirmed',
    createdAt: '2023-06-01T12:00:00Z'
  },
  {
    id: '2',
    courtId: '2',
    courtName: '서초 스포츠 센터',
    courtLocation: '서초구',
    courtImageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-06-20',
    startHour: 15,
    endHour: 17,
    price: 36000,
    status: 'pending',
    createdAt: '2023-06-05T09:30:00Z'
  },
  {
    id: '3',
    courtId: '3',
    courtName: '송파 배드민턴 아카데미',
    courtLocation: '송파구',
    courtImageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-06-12',
    startHour: 18,
    endHour: 19,
    price: 22000,
    status: 'cancelled',
    createdAt: '2023-06-02T17:45:00Z'
  }
]; 