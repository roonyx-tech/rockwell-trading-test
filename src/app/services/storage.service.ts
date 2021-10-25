import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { merge } from 'lodash';

export interface Trade {
  entryDate: Date,
  exitDate: Date,
  entryPrice: number,
  exitPrice: number,
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public history: BehaviorSubject<[]> = new BehaviorSubject(this.get('history') || []);
  public trade: BehaviorSubject<Trade> = new BehaviorSubject<Trade>(this.get('trade') || null);

  constructor() {
  }

  set(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  get(key: string) {
    const value = localStorage.getItem(key);
    return (value) ? JSON.parse(value) : null;
  }
  update(key: string, data: any) {
    const value = localStorage.getItem(key);
    localStorage.setItem(key, merge(value, data));
  }

  updateHistory(data: number) {
    const key = 'history';
    const value = this.get(key) || [];
    value.push(data);
    this.set(key, value);
    this.history.next(value);
  }

  updateTrade(data: Trade) {
    const key = 'trade';
    this.set(key, data);
    this.updateHistory(data.exitPrice);
    this.trade.next(data);
  }
}
