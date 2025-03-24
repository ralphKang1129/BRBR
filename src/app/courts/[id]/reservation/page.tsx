'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isToday, parseISO, addHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { 
  TimeSlot, 
  Court, 
  Booking, 
  SelectedTimeRange,
  MOCK_COURTS, 
  MOCK_BOOKINGS,
  PAYMENT_METHODS,
  saveBooking
} from '@/types';

// 타입 정의
interface PageProps {
  params: {
    id: string;
  };
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6AM to 10PM

export default function ReservationPage({ params }: PageProps) {
  const router = useRouter();
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRanges, setSelectedRanges] = useState<SelectedTimeRange[]>([]);
  const [currentRange, setCurrentRange] = useState<SelectedTimeRange | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [newBookings, setNewBookings] = useState<any[]>([]);
  const [court, setCourt] = useState<Court | undefined>(undefined);
  const [isCourtLoading, setIsCourtLoading] = useState(true);
  const [courtId, setCourtId] = useState<string>(params.id as string);
  
  // 코트 정보 로드
  useEffect(() => {
    const foundCourt = MOCK_COURTS.find((c: Court) => c.id === courtId);
    setCourt(foundCourt);
    setIsCourtLoading(false);
  }, [courtId]);
  
  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 코트를 찾을 수 없는 경우
  if (isCourtLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-700">코트를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }), // 월요일부터 시작
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  // 예약된 시간인지 확인
  const isTimeSlotBooked = (date: Date, hour: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return MOCK_BOOKINGS.some(
      booking =>
        booking.courtId === courtId &&
        booking.date === dateStr &&
        hour >= booking.startHour &&
        hour < booking.endHour
    );
  };

  // 선택된 시간인지 확인
  const isTimeSlotSelected = (date: Date, hour: number) => {
    // 현재 드래그 중인 범위 확인
    if (currentRange) {
      const startTime = new Date(currentRange.startDate);
      startTime.setHours(currentRange.startHour);
      
      const endTime = new Date(currentRange.endDate);
      endTime.setHours(currentRange.endHour);
      
      const currentTime = new Date(date);
      currentTime.setHours(hour);
      
      if (startTime <= currentTime && currentTime < endTime) {
        return true;
      }
    }
    
    // 이미 선택된 범위 확인
    return selectedRanges.some(range => {
      const startTime = new Date(range.startDate);
      startTime.setHours(range.startHour);
      
      const endTime = new Date(range.endDate);
      endTime.setHours(range.endHour);
      
      const currentTime = new Date(date);
      currentTime.setHours(hour);
      
      return startTime <= currentTime && currentTime < endTime;
    });
  };

  const handlePrevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  // 드래그 시작 핸들러
  const handleDragStart = (date: Date, hour: number) => {
    if (isTimeSlotBooked(date, hour) || isPastTimeSlot(date, hour)) return;
    
    setIsDragging(true);
    setCurrentRange({
      startDate: date,
      startHour: hour,
      endDate: date,
      endHour: hour + 1
    });
  };

  // 드래그 중 핸들러
  const handleDragOver = (date: Date, hour: number) => {
    if (!isDragging || isTimeSlotBooked(date, hour) || isPastTimeSlot(date, hour)) return;
    
    // 현재 범위 업데이트
    if (currentRange) {
      const startDate = currentRange.startDate;
      const startHour = currentRange.startHour;
      
      // 같은 날 내에서만 선택 가능하도록 제한
      if (isSameDay(startDate, date)) {
        if (hour >= startHour) {
          setCurrentRange({
            startDate,
            startHour,
            endDate: date,
            endHour: hour + 1
          });
        } else {
          // 역방향으로 드래그할 경우 시작과 끝을 바꿈
          setCurrentRange({
            startDate: date,
            startHour: hour,
            endDate: startDate,
            endHour: startHour + 1
          });
        }
      }
    }
  };

  // 드래그 끝 핸들러
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    if (currentRange) {
      // 이미 예약되어 있거나 과거인 시간대가 포함되어 있는지 확인
      let isValid = true;
      const startTime = new Date(currentRange.startDate);
      startTime.setHours(currentRange.startHour);
      
      const endTime = new Date(currentRange.endDate);
      endTime.setHours(currentRange.endHour);
      
      for (let hour = currentRange.startHour; hour < currentRange.endHour; hour++) {
        if (isTimeSlotBooked(currentRange.startDate, hour) || isPastTimeSlot(currentRange.startDate, hour)) {
          isValid = false;
          break;
        }
      }
      
      if (isValid) {
        setSelectedRanges([...selectedRanges, currentRange]);
      }
      
      setCurrentRange(null);
    }
  };

  // 선택된 시간 슬롯 삭제
  const handleRemoveTimeRange = (index: number) => {
    const newRanges = [...selectedRanges];
    newRanges.splice(index, 1);
    setSelectedRanges(newRanges);
  };

  // 모든 선택된 시간 슬롯 삭제
  const handleClearSelectedRanges = () => {
    setSelectedRanges([]);
  };

  // 과거 시간인지 확인
  const isPastTimeSlot = (date: Date, hour: number) => {
    const slotDate = new Date(date);
    slotDate.setHours(hour);
    return slotDate < new Date();
  };

  // 예약된 코트 정보 가져오기
  const getBookingForTimeSlot = (date: Date, hour: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return MOCK_BOOKINGS.find(
      booking =>
        booking.courtId === courtId &&
        booking.date === dateStr &&
        hour >= booking.startHour &&
        hour < booking.endHour
    );
  };

  // 선택된 시간의 총 금액 계산
  const calculateTotalPrice = () => {
    let totalHours = 0;
    
    selectedRanges.forEach(range => {
      totalHours += range.endHour - range.startHour;
    });
    
    return totalHours * court.price;
  };

  // 결제 처리
  const handlePayment = () => {
    setIsLoading(true);
    // 결제 프로세스 시뮬레이션
    setTimeout(() => {
      // 예약 저장
      try {
        const createdBookings = saveBooking(
          courtId,
          selectedRanges,
          selectedPaymentMethod
        );
        
        setNewBookings(createdBookings);
        setIsLoading(false);
        setPaymentSuccess(true);
        
        // 결제 완료 후 3초 후에 내 예약 페이지로 이동
        setTimeout(() => {
          router.push('/my-bookings');
        }, 3000);
      } catch (error) {
        console.error('예약 저장 중 오류 발생:', error);
        setIsLoading(false);
        alert('예약 처리 중 오류가 발생했습니다.');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{court.name} 예약</h1>
          <p className="mt-2 text-gray-600">{court.location} · {court.price.toLocaleString()}원/시간</p>
        </div>

        {/* 선택된 시간 슬롯 요약 */}
        {selectedRanges.length > 0 && (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">선택된 시간</h3>
              <button
                onClick={handleClearSelectedRanges}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                모두 삭제
              </button>
            </div>
            <div className="space-y-2">
              {selectedRanges.map((range, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-blue-50 p-3 rounded-md"
                >
                  <div>
                    <span className="font-medium">
                      {format(range.startDate, 'M월 d일', { locale: ko })} {range.startHour}:00 - {range.endHour}:00
                    </span>
                    <span className="ml-3 text-gray-600">
                      ({range.endHour - range.startHour}시간, {((range.endHour - range.startHour) * court.price).toLocaleString()}원)
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTimeRange(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xl font-bold">
                총 결제 금액: {calculateTotalPrice().toLocaleString()}원
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                결제하기
              </button>
            </div>
          </div>
        )}

        {/* 캘린더 컨트롤 */}
        <div className="bg-white rounded-t-lg border border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevWeek}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNextWeek}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  오늘
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {format(weekDays[0], 'yyyy년 M월', { locale: ko })}
              </h2>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setView('month')}
                className={"px-3 py-1.5 text-sm font-medium rounded transition-colors " + 
                  (view === 'month' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50')}
              >
                월
              </button>
              <button
                onClick={() => setView('week')}
                className={"px-3 py-1.5 text-sm font-medium rounded transition-colors " + 
                  (view === 'week' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50')}
              >
                주
              </button>
              <button
                onClick={() => setView('day')}
                className={"px-3 py-1.5 text-sm font-medium rounded transition-colors " + 
                  (view === 'day' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50')}
              >
                일
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="w-20 py-2 pr-4 border-r border-gray-200">
              <div className="text-xs font-medium text-gray-500 text-right">GMT+9</div>
            </div>
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={"py-2 border-r border-gray-200 " + 
                  (isToday(day) ? 'bg-blue-50' : '')}
              >
                <div className="px-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {format(day, 'EEE', { locale: ko })}
                  </div>
                  <div className={"text-2xl font-semibold " + 
                    (isToday(day) ? 'text-blue-600' : 'text-gray-900')}>
                    {format(day, 'd')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 시간 그리드 */}
          <div className="grid grid-cols-8 relative min-h-[800px]">
            {/* 시간 레이블 */}
            <div className="w-20 border-r border-gray-200">
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-200"
                >
                  <div className="text-xs font-medium text-gray-500 text-right pr-4 -mt-2">
                    {hour}:00
                  </div>
                </div>
              ))}
            </div>

            {/* 예약 슬롯 */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="border-r border-gray-200">
                {HOURS.map(hour => {
                  const isBooked = isTimeSlotBooked(day, hour);
                  const booking = getBookingForTimeSlot(day, hour);
                  const isSelected = isTimeSlotSelected(day, hour);
                  const isPast = isPastTimeSlot(day, hour);

                  return (
                    <div
                      key={hour}
                      onMouseDown={() => handleDragStart(day, hour)}
                      onMouseOver={() => handleDragOver(day, hour)}
                      onMouseUp={handleDragEnd}
                      className={"h-16 border-b border-gray-200 relative group transition-colors " + 
                        (isPast
                          ? 'bg-gray-50 cursor-not-allowed'
                          : isBooked
                          ? 'bg-blue-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-200 hover:bg-blue-300 cursor-pointer'
                          : 'hover:bg-blue-50 cursor-pointer')}
                    >
                      {/* 30분 구분선 */}
                      <div className="absolute w-full border-t border-gray-100 top-1/2 pointer-events-none"></div>
                      
                      {isBooked && (
                        <div className="absolute inset-0 p-1">
                          <div className={"h-full rounded px-2 py-1 text-xs " + 
                            (booking?.userName === '김철수' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800')}>
                            <div className="font-medium">{booking?.userName}</div>
                          </div>
                        </div>
                      )}

                      {!isBooked && !isPast && !isSelected && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                          <div className="text-xs font-medium text-blue-600">
                            드래그하여 예약
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* 현재 시간 표시 */}
            {weekDays.some(day => isToday(day)) && (
              <div 
                className="absolute left-0 right-0 flex items-center z-10 transition-all duration-300"
                style={{
                  top: `${((currentTime.getHours() - 6) * 64) + (currentTime.getMinutes() * 64 / 60)}px`
                }}
              >
                <div className="absolute -left-2 w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
                <div className="w-full border-t-2 border-red-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* 드래그 가이드 */}
        <div className="mt-4 bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-600">
          <strong className="text-gray-800">사용 방법:</strong> 드래그하여 여러 시간대를 선택할 수 있습니다. 같은 날짜 내에서만 연속 예약이 가능합니다.
        </div>
      </div>

      {/* 결제 모달 */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            {!paymentSuccess ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">결제 정보</h2>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-gray-700 mb-2">예약 정보</h3>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="mb-2">
                      <span className="font-medium">{court.name}</span>
                    </div>
                    {selectedRanges.map((range, index) => (
                      <div key={index} className="text-sm">
                        {format(range.startDate, 'yyyy년 M월 d일', { locale: ko })} {range.startHour}:00 - {range.endHour}:00
                        <span className="text-gray-500 ml-2">({range.endHour - range.startHour}시간)</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-gray-700 mb-2">결제 수단</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-3 rounded border ${
                          selectedPaymentMethod === method.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } flex items-center`}
                      >
                        <span className="text-xl mr-2">{method.icon}</span>
                        <span className="text-sm">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-gray-700 mb-2">결제 금액</h3>
                  <div className="flex justify-between items-center text-lg">
                    <span>총 결제 금액</span>
                    <span className="font-bold">{calculateTotalPrice().toLocaleString()}원</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className={`
                      px-6 py-3 rounded-md font-medium text-white
                      ${isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'}
                      transition-colors
                    `}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        결제 처리 중...
                      </div>
                    ) : (
                      '결제하기'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">결제 완료</h2>
                <p className="text-gray-600 mb-6">예약이 성공적으로 완료되었습니다.</p>
                <div className="bg-gray-50 rounded p-4 text-left mb-4">
                  <div className="mb-2">
                    <span className="font-medium">{court.name}</span>
                  </div>
                  {selectedRanges.map((range, index) => (
                    <div key={index} className="text-sm">
                      {format(range.startDate, 'yyyy년 M월 d일', { locale: ko })} {range.startHour}:00 - {range.endHour}:00
                    </div>
                  ))}
                  <div className="mt-2 text-green-600 font-medium">
                    결제 금액: {calculateTotalPrice().toLocaleString()}원
                  </div>
                </div>
                <p className="text-sm text-gray-500">확인 이메일이 발송되었습니다. 잠시 후 마이페이지로 이동합니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 