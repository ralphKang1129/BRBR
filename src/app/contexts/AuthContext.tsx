'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 사용자 타입 정의
export type UserType = 'ADMIN' | 'GYM_OWNER' | 'GYM_USER';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  createdAt: string;
  isAdmin: boolean;
  userType: UserType;
  // 체육관 대관자 관련 필드 추가
  gymAddress?: string;
  businessLicenseImage?: string;
  isVerified?: boolean; // 체육관 대관자 검증 여부
}

// 회원가입 시 사용할 데이터 타입
export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  userType: UserType;
  // 체육관 대관자 관련 필드 추가
  gymAddress?: string;
  businessLicenseImage?: string;
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean; // 관리자 여부 추가
  isGymOwner: boolean; // 체육관대관자 여부 추가
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 현재 사용자가 관리자인지 확인
  const isAdmin = user?.isAdmin || false;
  
  // 현재 사용자가 체육관대관자인지 확인
  const isGymOwner = user?.userType === 'GYM_OWNER';

  useEffect(() => {
    if (user) {
      console.log("사용자 타입 확인:", { 
        isAdmin: user.isAdmin, 
        userType: user.userType,
        isGymOwner: user.userType === 'GYM_OWNER'
      });
    }
  }, [user]);

  // 초기 로드 시 사용자 정보 확인 및 관리자 계정 생성
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 사용자 정보 가져오기 (로컬 스토리지 또는 세션 스토리지)
        let storedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        // 로컬 스토리지에 없으면 세션 스토리지 확인
        if (!storedUser) {
          storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
        }
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // 비밀번호 필드는 클라이언트에 노출하지 않음
          const { password, ...userWithoutPassword } = parsedUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true); // 저장된 사용자가 있으면 인증 상태를 true로 설정
          console.log("현재 로그인된 사용자:", userWithoutPassword);
        }

        // 로컬 스토리지에 사용자 배열이 없으면 초기화
        let users: User[] = [];
        const usersString = localStorage.getItem(USERS_STORAGE_KEY);
        
        if (usersString) {
          users = JSON.parse(usersString);
          console.log("저장된 사용자 목록:", users.map(({ password, ...rest }) => rest));
        } else {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
          console.log("사용자 목록 초기화됨");
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
          
          console.log('관리자 계정이 생성되었습니다:', adminUser);
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
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
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
      
      console.log("로그인 사용자:", foundUser);
      
      // 비밀번호를 제외한 사용자 정보 저장
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // 로그인 상태 유지 설정에 따라 저장 방식 결정
      if (rememberMe) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
        // 세션 스토리지의 데이터는 삭제
        sessionStorage.removeItem(USER_STORAGE_KEY);
      } else {
        // 세션 스토리지는 브라우저 닫으면 삭제됨
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
        // 기존 로컬 스토리지 데이터는 삭제
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true); // 로그인 성공 시 인증 상태를 true로 설정
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    // 로컬 스토리지와 세션 스토리지 모두에서 사용자 정보 삭제
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false); // 로그아웃 시 인증 상태를 false로 설정
  };

  // 회원가입 함수
  const signup = async (data: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      // 계정이 존재하는지 확인
      const usersString = localStorage.getItem(USERS_STORAGE_KEY);
      let users: User[] = usersString ? JSON.parse(usersString) : [];
      
      if (users.some(user => user.email === data.email)) {
        throw new Error('이미 등록된 이메일입니다.');
      }

      // 새 사용자 객체 생성
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        password: data.password, // 실제로는 해싱 처리
        name: data.name,
        phone: data.phone,
        createdAt: new Date().toISOString(),
        isAdmin: data.email === ADMIN_EMAIL, // admin 계정은 관리자 권한 부여
        userType: data.userType,
        // 체육관 대관자 관련 필드 추가
        gymAddress: data.gymAddress,
        businessLicenseImage: data.businessLicenseImage,
        isVerified: false, // 기본값은 미검증 상태
      };

      // 사용자 목록에 추가
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      console.log("새 사용자 등록됨:", newUser);
      
      // 비밀번호를 제외한 사용자 정보 저장
      const { password, ...userWithoutPassword } = newUser;
      
      // 회원가입 직후 자동 로그인 
      // 기본적으로 localStorage에 저장 (로그인 유지)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      sessionStorage.removeItem(USER_STORAGE_KEY);
      
      // 상태 업데이트
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
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
    isAuthenticated,
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