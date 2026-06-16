import { Component, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchQuery = signal('');
  @Output() search = new EventEmitter<string>();

  onSearchChange(val: string) {
    this.searchQuery.set(val);
    this.search.emit(val);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.search.emit('');
  }
}
