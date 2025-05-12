import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss']
})
export class CountryDropdownComponent implements OnInit {
  countries: any[] = [];
  selectedCountry: any = null;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  onCountrySelect(countryName: string): void {
    this.countryService.getCountryDetails(countryName).subscribe((data) => {
      this.selectedCountry = data[0];
    });
  }
}
