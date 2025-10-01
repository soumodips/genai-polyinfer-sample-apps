import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiRequestComponent } from './ai-request.component';

describe('AiRequestComponent', () => {
  let component: AiRequestComponent;
  let fixture: ComponentFixture<AiRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
