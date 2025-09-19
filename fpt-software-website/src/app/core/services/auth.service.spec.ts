import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService, LoginRequest, LoginResponse, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpClientSpy: jasmine.SpyObj<any>;

  const mockLoginResponse: LoginResponse = {
    access_token: 'mock-jwt-token',
    user: {
      id: 1,
      email: 'admin@fptsoftware.com',
      fullName: 'System Administrator',
      role: 'admin'
    }
  };

  const mockUser: User = {
    id: 1,
    email: 'admin@fptsoftware.com',
    fullName: 'System Administrator',
    role: 'admin'
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Get HttpClient spy from TestBed
    httpClientSpy = TestBed.inject(HttpClientTestingModule) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication State', () => {
    it('should initialize with no user when no token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      
      const newService = new AuthService(httpClientSpy, routerSpy);
      
      newService.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
      
      newService.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBeFalse();
      });
    });

    it('should initialize with user when token and user data exist', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'fpt_auth_token') return 'mock-token';
        if (key === 'fpt_user_data') return JSON.stringify(mockUser);
        return null;
      });
      
      const newService = new AuthService(httpClientSpy, routerSpy);
      
      newService.currentUser$.subscribe(user => {
        expect(user).toEqual(mockUser);
      });
      
      newService.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBeTrue();
      });
    });
  });

  describe('Login Functionality', () => {
    it('should login successfully and store token and user data', (done) => {
      const loginRequest: LoginRequest = {
        email: 'admin@fptsoftware.com',
        password: 'admin123'
      };

      httpClientSpy.post.and.returnValue(of(mockLoginResponse));
      spyOn(localStorage, 'setItem');

      service.login(loginRequest).subscribe({
        next: (response) => {
          expect(response).toEqual(mockLoginResponse);
          expect(localStorage.setItem).toHaveBeenCalledWith('fpt_auth_token', 'mock-jwt-token');
          expect(localStorage.setItem).toHaveBeenCalledWith('fpt_user_data', JSON.stringify(mockUser));
          done();
        }
      });
    });

    it('should handle login error', (done) => {
      const loginRequest: LoginRequest = {
        email: 'admin@fptsoftware.com',
        password: 'wrongpassword'
      };

      const errorResponse = { error: { message: 'Invalid credentials' } };
      httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toEqual(errorResponse);
          done();
        }
      });
    });
  });

  describe('Logout Functionality', () => {
    beforeEach(() => {
      spyOn(localStorage, 'removeItem');
    });

    it('should logout successfully and clear all data', () => {
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('fpt_auth_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('fpt_user_data');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should update authentication state after logout', (done) => {
      // First set up authenticated state
      service['currentUserSubject'].next(mockUser);
      service['isAuthenticatedSubject'].next(true);

      service.logout();

      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });

      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBeFalse();
        done();
      });
    });

    it('should handle multiple logout calls', () => {
      service.logout();
      service.logout();
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledTimes(6); // 2 calls per logout
      expect(routerSpy.navigate).toHaveBeenCalledTimes(3);
    });
  });

  describe('Token Management', () => {
    it('should get token from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('mock-token');
      
      const token = service.getToken();
      expect(token).toBe('mock-token');
      expect(localStorage.getItem).toHaveBeenCalledWith('fpt_auth_token');
    });

    it('should return null when no token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      
      const token = service.getToken();
      expect(token).toBeNull();
    });
  });

  describe('User Management', () => {
    it('should get user from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
      
      const user = service.getUser();
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem).toHaveBeenCalledWith('fpt_user_data');
    });

    it('should return null when no user data exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      
      const user = service.getUser();
      expect(user).toBeNull();
    });

    it('should handle invalid JSON in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('invalid-json');
      
      expect(() => service.getUser()).toThrow();
    });
  });

  describe('Authentication Checks', () => {
    it('should return true when user is authenticated', () => {
      service['isAuthenticatedSubject'].next(true);
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when user is not authenticated', () => {
      service['isAuthenticatedSubject'].next(false);
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should check user role correctly', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.hasRole('admin')).toBeTrue();
      expect(service.hasRole('editor')).toBeFalse();
    });

    it('should check multiple roles correctly', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.hasAnyRole(['admin', 'editor'])).toBeTrue();
      expect(service.hasAnyRole(['editor', 'user'])).toBeFalse();
    });

    it('should return false for role checks when no user', () => {
      service['currentUserSubject'].next(null);
      expect(service.hasRole('admin')).toBeFalse();
      expect(service.hasAnyRole(['admin', 'editor'])).toBeFalse();
    });

    it('should check admin role correctly', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.isAdmin()).toBeTrue();
      
      const editorUser = { ...mockUser, role: 'editor' };
      service['currentUserSubject'].next(editorUser);
      expect(service.isAdmin()).toBeFalse();
    });

    it('should check editor role correctly', () => {
      const editorUser = { ...mockUser, role: 'editor' };
      service['currentUserSubject'].next(editorUser);
      expect(service.isEditor()).toBeTrue();
      
      service['currentUserSubject'].next(mockUser);
      expect(service.isEditor()).toBeFalse();
    });

    it('should check admin or editor role correctly', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.isAdminOrEditor()).toBeTrue();
      
      const editorUser = { ...mockUser, role: 'editor' };
      service['currentUserSubject'].next(editorUser);
      expect(service.isAdminOrEditor()).toBeTrue();
      
      const userUser = { ...mockUser, role: 'user' };
      service['currentUserSubject'].next(userUser);
      expect(service.isAdminOrEditor()).toBeFalse();
    });
  });
});
