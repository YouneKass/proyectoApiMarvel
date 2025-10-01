import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { HomeComponent } from "../pages/home/home.component";
import { MarvelListComponent } from "../pages/marvel-List/layout/marvelList.component";
import { ComicsListaComponent } from "../pages/comics-lista/comics-lista.component";
import { MarvelListaComponent } from "../pages/marvel-List/components/marvel-lista.component";
import { CharacterDetailComponent } from "../pages/marvel-List/components/character-detail.component";
import { SeriesListaComponent } from "../pages/series-lista/series-lista.component";


export const layoutRoutes: Routes = [
    {
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', component: HomeComponent },
        { path: 'characters', component: MarvelListaComponent },
        { path: 'characters/:id', component: CharacterDetailComponent },
        { path: 'comics', component: ComicsListaComponent },
        { path: 'series', component: SeriesListaComponent }, 
        ]
    },
    { path: '**', redirectTo: '' }
];