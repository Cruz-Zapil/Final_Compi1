import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSymbolComponent } from './tabla-symbol.component';

describe('TablaSymbolComponent', () => {
  let component: TablaSymbolComponent;
  let fixture: ComponentFixture<TablaSymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaSymbolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
