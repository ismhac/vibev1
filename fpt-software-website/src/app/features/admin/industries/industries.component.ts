import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndustriesService, Industry, CreateIndustryRequest, UpdateIndustryRequest } from '../../../core/services/industries.service';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class IndustriesComponent implements OnInit {
  industries: Industry[] = [];
  loading = false;
  error: string | null = null;
  showIndustryForm = false;
  editingIndustry: Industry | null = null;
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalIndustries = 0;
  
  // Math object for template
  Math = Math;
  
  // Form data
  industryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private industriesService: IndustriesService
  ) {
    this.industryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      imageUrl: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadIndustries();
  }

  loadIndustries(): void {
    this.loading = true;
    this.error = null;
    
    this.industriesService.getIndustries(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.industries = response.data;
        this.totalIndustries = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load industries';
        this.loading = false;
        console.error('Error loading industries:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadIndustries();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIndustries();
  }

  onAddIndustry(): void {
    this.editingIndustry = null;
    this.industryForm.reset({
      name: '',
      description: '',
      imageUrl: '',
      isActive: true
    });
    this.showIndustryForm = true;
    document.body.style.overflow = 'hidden';
  }

  onEditIndustry(industry: Industry): void {
    this.editingIndustry = industry;
    this.industryForm.patchValue({
      name: industry.name,
      description: industry.description || '',
      imageUrl: industry.imageUrl || '',
      isActive: industry.isActive
    });
    this.showIndustryForm = true;
    document.body.style.overflow = 'hidden';
  }

  onSaveIndustry(): void {
    if (this.industryForm.invalid) {
      this.industryForm.markAllAsTouched();
      return;
    }

    if (this.editingIndustry) {
      this.updateIndustry();
    } else {
      this.createIndustry();
    }
  }

  createIndustry(): void {
    this.loading = true;
    const formData = this.industryForm.value as CreateIndustryRequest;
    this.industriesService.createIndustry(formData).subscribe({
      next: (industry) => {
        this.industries.unshift(industry); // Add new industry to the beginning of the list
        this.totalIndustries++;
        this.showIndustryForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to create industry';
        this.loading = false;
        console.error('Error creating industry:', error);
      }
    });
  }

  updateIndustry(): void {
    if (!this.editingIndustry) return;
    
    this.loading = true;
    const formData = this.industryForm.value as UpdateIndustryRequest;
    
    this.industriesService.updateIndustry(this.editingIndustry.id, formData).subscribe({
      next: (industry) => {
        const index = this.industries.findIndex(i => i.id === industry.id);
        if (index !== -1) {
          this.industries[index] = industry;
        }
        this.showIndustryForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to update industry';
        this.loading = false;
        console.error('Error updating industry:', error);
      }
    });
  }

  onDeleteIndustry(industry: Industry): void {
    if (confirm(`Are you sure you want to delete industry "${industry.name}"?`)) {
      this.loading = true;
      this.industriesService.deleteIndustry(industry.id).subscribe({
        next: () => {
          this.industries = this.industries.filter(i => i.id !== industry.id);
          this.totalIndustries--;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to delete industry';
          this.loading = false;
          console.error('Error deleting industry:', error);
        }
      });
    }
  }

  onCancelForm(): void {
    this.showIndustryForm = false;
    this.editingIndustry = null;
    document.body.style.overflow = '';
  }

  get totalPages(): number {
    return Math.ceil(this.totalIndustries / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStatusDisplayName(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }
}