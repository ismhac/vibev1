import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display three footer columns', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const columns = compiled.querySelectorAll('.footer-column');
    expect(columns).toHaveSize(3);
  });

  it('should display Contact us column with title and content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const contactTitle = compiled.querySelector(
      '.footer-column:first-child .footer-title'
    );
    expect(contactTitle?.textContent?.trim()).toBe('Contact us');
    expect(compiled.textContent).toContain('FPT Software Building');
    expect(compiled.textContent).toContain('+84 24 7300 8866');
  });

  it('should display About us column with title and content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const aboutTitle = compiled.querySelector(
      '.footer-column:nth-child(2) .footer-title'
    );
    expect(aboutTitle?.textContent?.trim()).toBe('About us');
    expect(compiled.textContent).toContain('FPT Software is a leading');
  });

  it('should display Statistics column with counter', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statsTitle = compiled.querySelector(
      '.footer-column:last-child .footer-title'
    );
    expect(statsTitle?.textContent?.trim()).toBe('Statistics');

    const counter = compiled.querySelector('.stat-number');
    expect(counter).toBeTruthy();
    expect(component.currentCounter).toBeGreaterThan(0);
  });

  it('should display current year in footer bottom', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const currentYear = new Date().getFullYear();
    expect(compiled.textContent).toContain(`© ${currentYear} FPT Software`);
    expect(component.currentYear).toBe(currentYear);
  });

  it('should initialize counter with default value', () => {
    expect(component.currentCounter).toBe(1234);
  });

  it('should clean up interval on destroy', () => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalled();
  });
});
