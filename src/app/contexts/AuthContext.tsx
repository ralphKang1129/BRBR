'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 사용자 타입 정의
export type UserType = 'ADMIN' | 'GYM_OWNER' | 'GYM_USER';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password: string; // 실제 환경에서는 클라이언트에 비밀번호를 저장하면 안 됨
  createdAt: string;
  isAdmin: boolean; // 관리자 여부 추가
  userType: UserType; // 사용자 타입 추가: 관리자, 체육관대관자, 체육관사용자
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean; // 관리자 여부 추가
  isGymOwner: boolean; // 체육관대관자 여부 추가
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: { email: string; password: string; name: string; phone?: string; userType: UserType }) => Promise<void>;
  getUsers: () => Omit<User, 'password'>[];
}

// 초기 컨텍스트 값
const initialAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false, // 관리자 여부 초기값
  isGymOwner: false, // 체육관대관자 여부 초기값
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  getUsers: () => [],
};

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType>(initialAuthContext);

// 인증 컨텍스트 훅
export const useAuth = () => useContext(AuthContext);

// 로컬 스토리지 키
const USER_STORAGE_KEY = 'currentUser';
const USERS_STORAGE_KEY = 'users';

// 관리자 계정 정보
const ADMIN_EMAIL = 'admin';
const ADMIN_PASSWORD = 'admin';

// 인증 프로바이더 컴포넌트
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 현재 사용자가 관리자인지 확인
  const isAdmin = user?.isAdmin || false;
  
  // 현재 사용자가 체육관대관자인지 확인
  const isGymOwner = user?.userType === 'GYM_OWNER';

  // 초기 로드 시 사용자 정보 확인 및 관리자 계정 생성
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 로컬 스토리지에서 현재 사용자 정보 가져오기
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // 비밀번호 필드는 클라이언트에 노출하지 않음
          const { password, ...userWithoutPassword } = parsedUser;
          setUser(userWithoutPassword);
        }

        // 로컬 스토리지에 사용자 배열이 없으면 초기화
        let users: User[] = [];
        const usersString = localStorage.getItem(USERS_STORAGE_KEY);
        
        if (usersString) {
          users = JSON.parse(usersString);
        } else {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        }

        // 관리자 계정 확인 및 생성
        const adminExists = users.some(u => u.email === ADMIN_EMAIL && u.isAdmin);
        
        if (!adminExists) {
          // 관리자 계정 생성
          const adminUser: User = {
            id: 'admin-id',
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            name: '관리자',
            createdAt: new Date().toISOString(),
            isAdmin: true,
            userType: 'ADMIN' // 관리자 타입
          };
          
          users.push(adminUser);
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      } catch (error) {
        console.error('Error initializing auth context:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // 모든 사용자 목록 가져오기 (비밀번호 제외)
  const getUsers = () => {
    try {
      const usersString = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersString) return [];
      
      const users: User[] = JSON.parse(usersString);
      return users.map(({ password, ...rest }) => rest);
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  // 로그인 함수
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 로컬 스토리지에서 사용자 목록 가져오기
      const usersString = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersString) {
        throw new Error('사용자 목록을 찾을 수 없습니다.');
      }

      const users: User[] = JSON.parse(usersString);
      
      // 이메일과 비밀번호가 일치하는 사용자 찾기
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('이메일/아이디 또는 비밀번호가 올바르지 않습니다.');
      }
      
      // 비밀번호를 제외한 사용자 정보 저장
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // 로컬 스토리지에 현재 사용자 정보 저장
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
      setUser(userWithoutPassword);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  // 회원가입 함수
  const signup = async (userData: { email: string; password: string; name: string; phone?: string; userType: UserType }) => {
    setIsLoading(true);
    try {
      // 로컬 스토리지에서 사용자 목록 가져오기
      const usersString = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersString) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      }

      const users: User[] = usersString ? JSON.parse(usersString) : [];
      
      // 이메일 중복 확인 (admin은 중복 검사에서 제외)
      if (userData.email !== ADMIN_EMAIL && users.some(u => u.email === userData.email)) {
        throw new Error('이미 사용 중인 이메일입니다.');
      }
      
      // 새 사용자 생성
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9), // 임시 ID 생성, 실제로는 서버에서 생성된 ID 사용
        email: userData.email,
        name: userData.name,
        password: userData.password, // 실제로는 서버에서 암호화하여 저장
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        isAdmin: userData.email === ADMIN_EMAIL, // admin 계정인 경우 관리자 권한 부여
        userType: userData.email === ADMIN_EMAIL ? 'ADMIN' : userData.userType // 사용자 타입 설정
      };
      
      // 사용자 목록에 추가
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // 로그인 처리 (비밀번호 제외)
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(userWithoutPassword);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 컨텍스트 값
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    isGymOwner,
    login,
    logout,
    signup,
    getUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 