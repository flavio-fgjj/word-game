import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public baseUrl = environment.apiEndpoint;

  public headers = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json'
  };

  constructor(private http: HttpClient) { }

  public async getRandonWords(fs2: string) {
    return await this.http.get(`${this.baseUrl}/api/randon-word/?q1=4&q2=${fs2}`).toPromise();
  }

  public async getWordData(word: string) {
    return await this.http.get(`${this.baseUrl}/api/word/${word}`).toPromise();
  }
}
