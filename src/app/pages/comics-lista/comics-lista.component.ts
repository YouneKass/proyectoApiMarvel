import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarvelService, Comic } from '../marvel-List/shared/services/marvel-api.service';

@Component({
    selector: 'app-comics-lista',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './comics-lista.component.html',
    styleUrls: ['./comics-lista.component.scss']
})
    export class ComicsListaComponent implements OnInit {
    q = signal<string>('');
    page = signal<number>(1);
    pageSize = signal<number>(20);
    total = signal<number>(0);
    loading = signal<boolean>(false);
    items = signal<Comic[]>([]);
    pages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

    constructor(private api: MarvelService) {}

    ngOnInit(): void { this.fetch(); }

    fetch(): void {
        this.loading.set(true);
        const limit = this.pageSize();
        const offset = (this.page() - 1) * limit;
        this.api.getComics({ titleStartsWith: this.q().trim() || undefined, limit, offset })
        .subscribe({
            next: (res) => {
            this.items.set(res.data.results);
            this.total.set(res.data.total);
            this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    onSearch() { this.page.set(1); this.fetch(); }
    prevPage() { if (this.page() > 1) { this.page.set(this.page()-1); this.fetch(); } }
    nextPage() { if (this.page() < this.pages()) { this.page.set(this.page()+1); this.fetch(); } }
    setPage(p: number) { if (p>=1 && p<=this.pages()) { this.page.set(p); this.fetch(); } }

    thumbUrl(c: Comic) {
        const t = c.thumbnail;
        return `${t.path}/portrait_uncanny.${t.extension}`;
    }

    trackById = (_: number, c: Comic) => c.id;
}