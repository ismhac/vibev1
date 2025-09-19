import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Industries } from './industries';

describe('Industries', () => {
  let component: Industries;
  let fixture: ComponentFixture<Industries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Industries, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Industries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
