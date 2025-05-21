import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country',
  standalone: true,
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  imports: [CommonModule]
})
export class CountryComponent implements OnInit {
  countries: any[] = [];
  selectedCountry: any = null;
  selectedFlag: string = '';
  selectedCurrency: any = {};
  selectedCapital: string = '';
  selectedLanguages: string[] = [];
  isLoading: boolean = false;
  videos: string[] = [
    'assets/mountain.mp4',
    'assets/beach.mp4'
  ];
  currentVideo: string = this.videos[0];
  videoIndex: number = 0;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.startVideoLoop();
    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        this.countries = data.sort((a, b) => a.name.localeCompare(b.name));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching countries:', err);
        this.isLoading = false;
      }
    });
  }

  onCountrySelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const countryName = selectElement.value;
    if (countryName) {
      this.isLoading = true;
      this.countryService.getCountryDetails(countryName).subscribe({
        next: (data: any) => {
          this.selectedCountry = data;
          this.selectedFlag = data.flag;
          this.selectedCurrency = data.currency;
          this.selectedCapital = data.capital;
          this.selectedLanguages = data.languages;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error fetching country details:', err);
          this.selectedCountry = null;
          this.selectedFlag = '';
          this.selectedCurrency = {};
          this.selectedCapital = '';
          this.selectedLanguages = [];
          this.isLoading = false;
        }
      });
    } else {
      this.selectedCountry = null;
      this.selectedFlag = '';
      this.selectedCurrency = {};
      this.selectedCapital = '';
      this.selectedLanguages = [];
      this.isLoading = false;
    }
  }

  startVideoLoop(): void {
    setInterval(() => {
      this.videoIndex = (this.videoIndex + 1) % this.videos.length;
      this.currentVideo = this.videos[this.videoIndex];
    }, 90000); // 1.5 minutes = 90,000 ms
  }
}
