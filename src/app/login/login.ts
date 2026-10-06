import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  id = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    if (!this.authService.login(this.id, this.password)) {
      this.errorMessage = 'Incorrect ID or password.';
      return;
    }

    this.errorMessage = '';
    void this.router.navigateByUrl('/todos');
  }
}
