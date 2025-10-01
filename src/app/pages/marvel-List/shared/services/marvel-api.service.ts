import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Md5 } from 'ts-md5';


export interface MarvelList<T> {
    code: number;
    status: string;
    data: {
        offset: number;
        limit: number;
        total: number;
        count: number;
        results: T[];
    };
    }

    export interface MarvelImage { path: string; extension: string; }
    export interface MarvelUrl { type: string; url: string; }

    export interface Character {
    id: number;
    name: string;
    description: string;
    thumbnail: MarvelImage;
    resourceURI: string;
    urls: MarvelUrl[];
    }

    export interface Comic {
    id: number;
    title: string;
    description: string;
    thumbnail: MarvelImage;
    urls: MarvelUrl[];
    }

    export interface Serie {
    id: number;
    title: string;
    description: string;
    thumbnail: MarvelImage;
    urls: MarvelUrl[];
    }

    @Injectable({ providedIn: 'root' })
    export class MarvelService {
    private publicKey = '8ef930fe41e38296273a6b076a7d0e44';
    private privateKey = '38af998af5d95f240dd48e6fc39378e55588f845';
    private readonly apiUrl = 'https://gateway.marvel.com/v1/public';

    constructor(private http: HttpClient) {}

    private authParams(): HttpParams {
        const ts = Date.now().toString();
        const hash = Md5.hashStr(ts + this.privateKey + this.publicKey) as string;
        return new HttpParams().set('ts', ts).set('apikey', this.publicKey).set('hash', hash);
    }

    getCharacters(opts: { name?: string; nameStartsWith?: string; limit?: number; offset?: number } = {})
        : Observable<MarvelList<Character>> {
        let params = this.authParams();
        if (opts.name) params = params.set('name', opts.name);
        if (opts.nameStartsWith) params = params.set('nameStartsWith', opts.nameStartsWith);
        if (opts.limit != null) params = params.set('limit', String(opts.limit));
        if (opts.offset != null) params = params.set('offset', String(opts.offset));
        // Orden estable para que no “salten” entre páginas
        params = params.set('orderBy', 'name');

        return this.http.get<MarvelList<Character>>(`${this.apiUrl}/characters`, { params });
    }

    getCharacterById(id: number): Observable<MarvelList<Character>> {
        const params = this.authParams();
        return this.http.get<MarvelList<Character>>(`${this.apiUrl}/characters/${id}`, { params });
    }
    
    getComics(opts: { title?: string; titleStartsWith?: string; limit?: number; offset?: number } = {}) {
        let params = this.authParams().set('orderBy', 'title');
        if (opts.title) params = params.set('title', opts.title);
        if (opts.titleStartsWith) params = params.set('titleStartsWith', opts.titleStartsWith);
        if (opts.limit != null) params = params.set('limit', String(opts.limit));
        if (opts.offset != null) params = params.set('offset', String(opts.offset));

        return this.http.get<MarvelList<Comic>>(`${this.apiUrl}/comics`, { params });
    }

    getSeries(opts: { title?: string; titleStartsWith?: string; limit?: number; offset?: number } = {}) {
        let params = this.authParams().set('orderBy', 'title');
        if (opts.title) params = params.set('title', opts.title);
        if (opts.titleStartsWith) params = params.set('titleStartsWith', opts.titleStartsWith);
        if (opts.limit != null) params = params.set('limit', String(opts.limit));
        if (opts.offset != null) params = params.set('offset', String(opts.offset));

        return this.http.get<MarvelList<Serie>>(`${this.apiUrl}/series`, { params });
    }

}