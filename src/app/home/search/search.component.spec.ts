import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search query when query changes', () => {
    let emittedQuery = '';
    component.search.subscribe((q: string) => {
      emittedQuery = q;
    });

    component.onSearchChange('Angular tutorial');
    expect(emittedQuery).toBe('Angular tutorial');
  });
});
