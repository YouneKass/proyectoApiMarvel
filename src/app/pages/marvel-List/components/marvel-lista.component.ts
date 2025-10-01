import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Character, MarvelService } from '../shared/services/marvel-api.service';

@Component({
  selector: 'app-marvel-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './marvel-lista.component.html',
  styleUrl: './marvel-lista.component.scss'
})
export class MarvelListaComponent implements OnInit{
  q = signal<string>('');          // búsqueda (nameStartsWith)
    page = signal<number>(1);        // página 1-based
    pageSize = signal<number>(20);   // 20 como PokeApi
    total = signal<number>(0);
    loading = signal<boolean>(false);
    items = signal<Character[]>([]);

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
        limit, offset
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
