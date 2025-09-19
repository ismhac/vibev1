import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  returnUrl: string = '/admin';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/admin'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
    
    // If already authenticated, redirect to return URL
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = null;

      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response: any) => {
          this.loading = false;
          // Redirect to return URL or admin dashboard
          this.router.navigate([this.returnUrl]);
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (error.status === 401) {
      return 'Invalid email or password. Please try again.';
    } else if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    } else {
      return 'An error occurred during login. Please try again.';
    }
  }

  getFormControl(controlName: string) {
    return this.loginForm.get(controlName);
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.getFormControl(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.getFormControl(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `Password must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}
