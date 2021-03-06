import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { TimePeriod } from './time-period.model';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  quotes$ = this.priceQuery.priceQueries$;
  endDate = new Date();
  startDate = new Date();

  timePeriods: Array<TimePeriod> = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      periodStart: [null, Validators.required],
      periodEnd: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.stockPickerForm.get('periodStart').valueChanges
      .subscribe((periodStartValue) => {
        if (periodStartValue) {
          if (
            this.stockPickerForm.controls['periodEnd'].value &&
            this.stockPickerForm.controls['periodEnd'].value < periodStartValue
          ) {
            this.stockPickerForm.controls['periodEnd'].setValue(periodStartValue);
          }
          this.startDate = periodStartValue;

        }
      });

    this.stockPickerForm.valueChanges
      .subscribe(this.fetchQuote);
  }

  fetchQuote = () => {
    if (this.stockPickerForm.valid) {
      const { symbol, periodStart, periodEnd } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, { startDate: periodStart, endDate: periodEnd });
    }
  }
}
