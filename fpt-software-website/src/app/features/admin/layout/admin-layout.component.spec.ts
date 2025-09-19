import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminLayoutComponent } from './admin-layout.component';
import { AuthService, User } from '../../../core/services/auth.service';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: 'admin@fptsoftware.com',
    fullName: 'System Administrator',
    role: 'admin'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of(mockUser)
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data from AuthService', () => {
    fixture.detectChanges();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should display user name correctly', () => {
    fixture.detectChanges();
    expect(component.userName).toBe('System Administrator');
  });

  it('should display user role correctly', () => {
    fixture.detectChanges();
    expect(component.userRole).toBe('admin');
  });

  it('should display user email correctly', () => {
    fixture.detectChanges();
    expect(component.userEmail).toBe('admin@fptsoftware.com');
  });

  it('should handle null user gracefully', () => {
    authServiceSpy.currentUser$ = of(null);
    fixture.detectChanges();
    
    expect(component.userName).toBe('Unknown User');
    expect(component.userRole).toBe('Unknown');
    expect(component.userEmail).toBe('Unknown Email');
  });

  it('should toggle sidebar state', () => {
    expect(component.sidebarCollapsed).toBeFalse();
    
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBeTrue();
    
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBeFalse();
  });

  describe('Logout Functionality', () => {
    it('should call AuthService logout method when logout is called', () => {
      component.logout();
      expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle logout with no user data', () => {
      authServiceSpy.currentUser$ = of(null);
      fixture.detectChanges();
      
      component.logout();
      expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple logout calls', () => {
      component.logout();
      component.logout();
      component.logout();
      
      expect(authServiceSpy.logout).toHaveBeenCalledTimes(3);
    });
  });

  describe('Component State', () => {
    it('should initialize with correct default values', () => {
      expect(component.currentUser).toBeNull();
      expect(component.sidebarCollapsed).toBeFalse();
    });

    it('should update currentUser when AuthService emits new user', () => {
      const newUser: User = {
        id: 2,
        email: 'editor@fptsoftware.com',
        fullName: 'Content Editor',
        role: 'editor'
      };
      
      authServiceSpy.currentUser$ = of(newUser);
      fixture.detectChanges();
      
      expect(component.currentUser).toEqual(newUser);
    });
  });
});
