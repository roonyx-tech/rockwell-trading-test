import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { StorageService, Trade } from '../../services/storage.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})
export class TradingComponent implements OnInit {
  public isEdit: boolean = false;
  public today;
  public form: FormGroup;
  public profit: number;

  constructor(
    private _ref: MatDialogRef<TradingComponent>,
    private _storeService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { trade: Trade }) {
    const trade = this.data.trade;
    this.isEdit = !isEmpty(trade);

    const format = 'YYYY-MM-DD';
    const today = moment().format(format);
    const entryDate = trade.entryDate || today;
    const exitDate = trade.exitDate || today;
    const entryPrice = trade.entryPrice || 0.1;
    const exitPrice = trade.exitPrice || 0.1;
    this.profit = 0;
    this.today = today;
    this.form = new FormGroup({
      'entryDate': new FormControl(entryDate, [Validators.required]),
      'entryPrice': new FormControl(entryPrice, [Validators.required, Validators.min(0.1)]),
      'exitDate': new FormControl(exitDate, [Validators.required]),
      'exitPrice': new FormControl(exitPrice, [Validators.required, Validators.min(0.1)]),
    });
  }

  ngOnInit(): void {
  }

  submit() {
    const form = this.form;
    if (form.invalid) {
      return false;
    }
    this._storeService.updateTrade(form.value);
    this._ref.close();
    return true;
  }

  cancel() {
    this._ref.close();
  }
}
