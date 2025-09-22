import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { HomeComponent } from "../pages/home/home.component";
import { MarvelListComponent } from "../pages/marvel-List/layout/marvelList.component";


export const layoutRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: '', component: HomeComponent},
            {path: 'marvelList', component: MarvelListComponent}
        ]
        
    }
];