import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MarvelService } from '../shared/services/marvel-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marvelList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marvelList.component.html',
  styleUrls: ['./marvelList.component.scss']
})
export class MarvelListComponent implements OnInit {
  characters: any[] = [];

  constructor(private marvelService: MarvelService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.marvelService.getAllCharacters().subscribe({
      next: (response) => {
        console.log('Lista de personajes de Marvel:', response.data.results);
        this.characters = response.data.results;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener la lista de personajes de Marvel', err)
    });
  }

}
