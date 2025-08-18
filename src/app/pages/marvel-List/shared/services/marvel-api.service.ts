import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Md5 } from 'ts-md5';


@Injectable({
    providedIn: 'root'
})
export class MarvelService {
    private publicKey = '8ef930fe41e38296273a6b076a7d0e44'; 
    private privateKey = '38af998af5d95f240dd48e6fc39378e55588f845'; 
    private readonly apiUrl = 'https://gateway.marvel.com/v1/public';

    constructor(private http: HttpClient) { }

    getCharactersByName(name: string): Observable<any> {
        const timestamp = new Date().getTime();
        const hash = Md5.hashStr(timestamp + this.privateKey + this.publicKey);

        const params = new HttpParams()
        .set('ts', timestamp.toString())
        .set('apikey', this.publicKey)
        .set('hash', hash)
        .set('name', name);

        return this.http.get(`${this.apiUrl}/characters`, { params });
    }

    getAllCharacters(): Observable<any> {
    const timestamp = new Date().getTime();
    const hash = Md5.hashStr(timestamp + this.privateKey + this.publicKey);

    const params = new HttpParams()
        .set('ts', timestamp.toString())
        .set('apikey', this.publicKey)
        .set('hash', hash);

        return this.http.get(`${this.apiUrl}/characters`, { params });
    }
}