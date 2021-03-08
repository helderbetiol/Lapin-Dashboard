import { Injectable } from '@angular/core';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root',
})
export class InfluxQueryService {
  private url = 'api/v2/query';

  constructor(private serverService: ServerService) { }

  getData = () => {
    return this.serverService.post(this.url, 'from(bucket:"rabbit") |> range(start: 0)  |> filter(fn:(r) => r._measurement == "adrenaline")');
  }

  getIntents = () => {
    return this.serverService.get(this.url);
  }

  getIntent = (id) => {
    const url = `${this.url}/${id}`;
    return this.serverService.get(url);
  }

  getTopics() {
    return this.serverService.get('topics');
  }

  addQuestion = (id, question) => {
    const url = `${this.url}/${id}`;
    const data = question;
    return this.serverService.put(url, data);
  }

  addAnswer = (id, answer) => {
    const url = `${this.url}/${id}`;
    const data = answer;
    return this.serverService.put(url, data);
  }

  removeAnswer = (id, answerId) => {
    const url = `${this.url}/${id}/message/${answerId}`;
    return this.serverService.delete(url);
  }

  removeQuestion = (id, questionId) => {
    const url = `${this.url}/${id}/phrase/${questionId}`;
    return this.serverService.delete(url);
  }
}
