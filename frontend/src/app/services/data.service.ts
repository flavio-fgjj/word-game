import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public baseUrl = environment.apiEndpoint;
  public validationUrl = environment.validationEndpoint;

  public httpOptions = {
    headers: new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json'
    })
  };

  private query: string;

  constructor(private http: HttpClient) { }

  // getWords(): Observable<any> {
  //   this.query = `
  //   query {
  //     words {
  //       word
  //       grammatical_class
  //       meaning
  //       synonyms
  //       antonyms
  //       phrase {
  //         author
  //         phrase
  //         font
  //       }
  //     }
  //   }
  //  `;

  //   return this.http.post(
  //     `${this.baseUrl}`,
  //     JSON.stringify({ query: this.query }),
  //     this.httpOptions
  //   );
  // }

  getWords(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}`
    );
  }

  async wordValidation(word: string) {
    return await this.http.get(
      `${this.validationUrl}/${word}`
    ).toPromise();
  }
}
