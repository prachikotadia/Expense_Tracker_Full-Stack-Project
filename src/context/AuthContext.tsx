
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (email: string, name: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // In a real app, validate against a backend
    const savedUser = localStorage.getItem('users');
    const users = savedUser ? JSON.parse(savedUser) : [];
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userData = { email: user.email, name: user.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = (email: string, name: string, password: string) => {
    // In a real app, this would be handled by a backend
    const savedUser = localStorage.getItem('users');
    const users = savedUser ? JSON.parse(savedUser) : [];
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    users.push({ email, name, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
