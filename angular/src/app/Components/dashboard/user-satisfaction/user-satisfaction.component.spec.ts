import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSatisfactionComponent } from './user-satisfaction.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../../../app.component';

describe('UserSatisfactionComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have get data', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
