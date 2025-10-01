import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';
import { Character, MarvelService } from '../shared/services/marvel-api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marvelList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marvelList.component.html',
  styleUrls: ['./marvelList.component.scss']
})
export class MarvelListComponent implements OnInit {
   q = signal<string>('');          // término de búsqueda
  page = signal<number>(1);        // página actual
  pageSize = signal<number>(20);   // personajes por página
  total = signal<number>(0);       // total de resultados
  items = signal<Character[]>([]); // personajes a mostrar
  loading = signal<boolean>(false);
  pages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  constructor(private api: MarvelService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    const limit = this.pageSize();
    const offset = (this.page() - 1) * limit;

    this.api.getCharacters({
      nameStartsWith: this.q().trim() || undefined,
      limit,
      offset
    }).subscribe({
      next: (res) => {
        this.items.set(res.data.results);
        this.total.set(res.data.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void {
    this.page.set(1);
    this.fetch();
  }

  goToDetail(c: Character) {
    this.router.navigate(['/characters', c.id]);
  }

  prevPage() { if (this.page() > 1) { this.page.set(this.page() - 1); this.fetch(); } }
  nextPage() { if (this.page() < this.pages()) { this.page.set(this.page() + 1); this.fetch(); } }
  setPage(p: number) { if (p >= 1 && p <= this.pages()) { this.page.set(p); this.fetch(); } }

  thumbUrl(c: Character) {
    const t = c.thumbnail;
    return `${t.path}/standard_fantastic.${t.extension}`;
  }

  trackById = (_: number, c: Character) => c.id;
}
