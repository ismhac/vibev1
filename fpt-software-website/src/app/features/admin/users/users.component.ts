import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User, CreateUserRequest, UpdateUserRequest } from '../../../core/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  showUserForm = false;
  editingUser: User | null = null;
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  
  // Search and Filter
  selectedRole = '';
  selectedStatus = '';
  showFilters = false;
  filterOptions = {
    roles: [] as string[],
    statuses: ['active', 'inactive']
  };
  
  // Form data
  userForm: CreateUserRequest = {
    email: '',
    password: '',
    fullName: '',
    role: 'viewer',
    isActive: true
  };
  
  availableRoles = ['admin', 'editor', 'viewer'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadUsers();
  }

  loadFilterOptions(): void {
    this.userService.getFilterOptions().subscribe({
      next: (options) => {
        this.filterOptions.roles = options.roles;
      },
      error: (error) => {
        console.error('Error loading filter options:', error);
        // Fallback to default roles
        this.filterOptions.roles = this.availableRoles;
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    console.log('Component calling service with params:', {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchTerm,
      role: this.selectedRole,
      status: this.selectedStatus
    });
    
    this.userService.getUsers(
      this.currentPage, 
      this.pageSize, 
      this.searchTerm,
      this.selectedRole,
      this.selectedStatus
    ).subscribe({
      next: (response) => {
        console.log('Service response:', response);
        this.users = response.data;
        this.totalUsers = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  onToggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onAddUser(): void {
    this.editingUser = null;
    this.userForm = {
      email: '',
      password: '',
      fullName: '',
      role: 'viewer',
      isActive: true
    };
    this.showUserForm = true;
  }

  onEditUser(user: User): void {
    this.editingUser = user;
    this.userForm = {
      email: user.email,
      password: '',
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive
    };
    this.showUserForm = true;
  }

  onSaveUser(): void {
    if (this.editingUser) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    this.loading = true;
    this.userService.createUser(this.userForm).subscribe({
      next: (user) => {
        this.users.unshift(user);
        this.totalUsers++;
        this.showUserForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to create user';
        this.loading = false;
        console.error('Error creating user:', error);
      }
    });
  }

  updateUser(): void {
    if (!this.editingUser) return;
    
    this.loading = true;
    const updateData: UpdateUserRequest = {
      email: this.userForm.email,
      fullName: this.userForm.fullName,
      role: this.userForm.role,
      isActive: this.userForm.isActive
    };
    
    this.userService.updateUser(this.editingUser.id, updateData).subscribe({
      next: (user) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
        }
        this.showUserForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to update user';
        this.loading = false;
        console.error('Error updating user:', error);
      }
    });
  }

  onDeleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.fullName}"?`)) {
      this.loading = true;
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.totalUsers--;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to delete user';
          this.loading = false;
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  onCancelForm(): void {
    this.showUserForm = false;
    this.editingUser = null;
  }

  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getRoleDisplayName(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  getStatusDisplayName(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }
}
