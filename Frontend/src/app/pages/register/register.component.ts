import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const userData = { username: this.username, email: this.email, password: this.password };
    this.http.post(`${environment.apiUrl}/user/register`, userData).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.error || 'Registration failed';
      }
    });
  }
}
