import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Character, MarvelService } from '../shared/services/marvel-api.service';

@Component({
  selector: 'app-character-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss'
})
export class CharacterDetailComponent implements OnInit {
  loading = signal<boolean>(true);
  character = signal<Character | null>(null);

  constructor(private route: ActivatedRoute, private api: MarvelService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCharacterById(id).subscribe({
      next: (res) => {
        this.character.set(res.data.results[0] ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  bigImg(c: Character) {
    const t = c.thumbnail;
    return `${t.path}/portrait_uncanny.${t.extension}`;
  }
}
