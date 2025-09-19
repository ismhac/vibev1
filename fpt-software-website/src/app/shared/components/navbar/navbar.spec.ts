import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Navbar } from './navbar';
import { TranslationService } from '../../../core/translate/translation.service';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let translationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['translate', 'setLanguage']);

    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: TranslationService, useValue: translationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    
    // Mock translation service methods
    translationService.translate.and.returnValue('FPT Software');
    translationService.setLanguage.and.returnValue();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo and navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.navbar-logo')).toBeTruthy();
    expect(compiled.querySelector('.logo-text')?.textContent).toContain(
      'FPT Software'
    );
    expect(compiled.querySelectorAll('li[nz-menu-item]')).toHaveSize(5);
  });

  it('should check if route is active', () => {
    expect(component.isRouteActive('/home')).toBeFalsy(); // Default route is '/'
  });
});
