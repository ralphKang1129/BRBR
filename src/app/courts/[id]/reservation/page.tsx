import { Metadata } from 'next';
import ReservationClient from './ReservationClient';

type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
  title: '코트 예약',
  description: '배드민턴 코트 예약 페이지입니다.',
};

export default function ReservationPage(props: Props) {
  return <ReservationClient {...props} />;
} 