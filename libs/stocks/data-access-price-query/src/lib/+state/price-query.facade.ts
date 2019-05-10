import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getAllPriceQueries } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';
import { PriceDateRange } from './price-query.type'

@Injectable()
export class PriceQueryFacade {
  selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));
  priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries => priceQueries.filter((priceQuery) => {
      const startDate = new Date(this.dateRange.startDate);
      const endDate = new Date(this.dateRange.endDate);
      const date = new Date(priceQuery.date);
      const isDateValid = (date > startDate && date < endDate) ? true : false;
      return isDateValid;
    }).map(priceQuery => [priceQuery.date, priceQuery.close])
    ));

  private dateRange: PriceDateRange = <PriceDateRange> {};

  constructor(private store: Store<PriceQueryPartialState>) { }

  fetchQuote(symbol: string, priceDateRange: PriceDateRange) {
    const startDate = new Date(priceDateRange.startDate);
    const endDate = new Date();
    const yearDifference = endDate.getFullYear() - startDate.getFullYear();
    let period = '';
    if (yearDifference === 0) {

      const monthDifference = endDate.getMonth() - startDate.getMonth();
      switch (true) {
        case (monthDifference < 2):
          period = '1m';
          break;

        case (monthDifference < 4):
          period = '3m';
          break;

        case (monthDifference < 7):
          period = '6m';
          break;

        default:
          period = 'ytd';
      }
    } else {
      switch (true) {
        case (yearDifference < 2):
          period = '1y';
          break;

        case (yearDifference < 3):
          period = '2y';
          break;

        case (yearDifference < 6):
          period = '5y';
          break;

        default:
          period = 'max';
      }
    }
    this.dateRange = priceDateRange;

    this.store.dispatch(new FetchPriceQuery(symbol, period));
  }
}
