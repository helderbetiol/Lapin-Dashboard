import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InfluxQueryService {
  private url = 'lapin/';

  constructor(private serverService: ServerService) { }

  getData = (measure, group, field, limit) => {
    const params = new HttpParams().set('limit', limit).set('field', field);
    return this.serverService.get(this.url + measure + '/' + group, params);
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
