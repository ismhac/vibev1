import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementsService, Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest, FilterOptions } from '../../../core/services/announcements.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AnnouncementsComponent implements OnInit {
  
  announcements: Announcement[] = [];
  loading = false;
  error: string | null = null;
  showAnnouncementForm = false;
  editingAnnouncement: Announcement | null = null;
  searchTerm = '';
  
  // Filter properties
  selectedCategory = '';
  selectedPriority = '';
  selectedStatus = '';
  selectedAuthor = '';
  showFilters = false;
  filterOptions: FilterOptions = {
    categories: [],
    priorities: [],
    statuses: [],
    authors: []
  };
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalAnnouncements = 0;
  
  // Math object for template
  Math = Math;
  
  // Form data
  announcementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private announcementsService: AnnouncementsService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      summary: ['', [Validators.maxLength(500)]],
      author: ['', [Validators.maxLength(255)]],
      category: ['', [Validators.maxLength(100)]],
      priority: ['medium', [Validators.required]],
      isPublished: [true],
      tags: [[]],
      imageUrl: ['', [Validators.maxLength(500)]],
      readTime: [5, [Validators.min(1)]]
    });
  }

  // File upload
  selectedFile: File | null = null;
  filePreview: string | null = null;
  

  // Available options
  availablePriorities = ['low', 'medium', 'high'];
  availableCategories = ['News', 'Updates', 'Events', 'General', 'Technical'];

  

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadAnnouncements();
  }

  loadFilterOptions(): void {
    this.announcementsService.getFilterOptions().subscribe({
      next: (options) => {
        this.filterOptions = options;
        console.log('Filter options loaded:', options);
      },
      error: (error) => {
        console.error('Error loading filter options:', error);
      }
    });
  }

  loadAnnouncements(): void {
    this.loading = true;
    this.error = null;
    
    this.announcementsService.getAnnouncementsForAdmin(
      this.currentPage, 
      this.pageSize, 
      this.searchTerm
    ).subscribe({
      next: (response) => {
        this.announcements = response.data;
        this.totalAnnouncements = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load announcements';
        this.loading = false;
        console.error('Error loading announcements:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadAnnouncements();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAnnouncements();
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedPriority = '';
    this.selectedStatus = '';
    this.selectedAuthor = '';
    this.currentPage = 1;
    this.loadAnnouncements();
  }

  onToggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAnnouncements();
  }

  onAddAnnouncement(): void {
    this.editingAnnouncement = null;
    this.announcementForm.reset({
      title: '',
      content: '',
      summary: '',
      author: '',
      category: '',
      priority: 'medium',
      isPublished: true,
      tags: [],
      imageUrl: '',
      readTime: 5
    });
    this.selectedFile = null;
    this.filePreview = null;
    this.showAnnouncementForm = true;
    document.body.style.overflow = 'hidden';
  }

  onEditAnnouncement(announcement: Announcement): void {
    this.editingAnnouncement = announcement;
    this.announcementForm.patchValue({
      title: announcement.title,
      content: announcement.content,
      summary: announcement.summary || '',
      author: announcement.author || '',
      category: announcement.category || '',
      priority: announcement.priority,
      isPublished: announcement.isPublished,
      tags: announcement.tags || [],
      imageUrl: announcement.imageUrl || '',
      readTime: announcement.readTime || 5
    });
    this.selectedFile = null;
    this.filePreview = announcement.imageUrl || null;
    this.showAnnouncementForm = true;
    document.body.style.overflow = 'hidden';
  }

  onSaveAnnouncement(): void {
    if (this.announcementForm.invalid) {
      this.announcementForm.markAllAsTouched();
      return;
    }


    if (this.editingAnnouncement) {
      this.updateAnnouncement();
    } else {
      this.createAnnouncement();
    }
  }

  createAnnouncement(): void {
    this.loading = true;
    const formData = this.announcementForm.value as CreateAnnouncementRequest;
    this.announcementsService.createAnnouncement(formData, this.selectedFile || undefined).subscribe({
      next: (announcement) => {
        this.announcements.unshift(announcement);
        this.totalAnnouncements++;
        this.showAnnouncementForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to create announcement';
        this.loading = false;
        console.error('Error creating announcement:', error);
      }
    });
  }

  updateAnnouncement(): void {
    if (!this.editingAnnouncement) return;
    
    this.loading = true;
    const formData = this.announcementForm.value as UpdateAnnouncementRequest;
    this.announcementsService.updateAnnouncement(this.editingAnnouncement.id, formData, this.selectedFile || undefined).subscribe({
      next: (announcement) => {
        const index = this.announcements.findIndex(a => a.id === announcement.id);
        if (index !== -1) {
          this.announcements[index] = announcement;
        }
        this.showAnnouncementForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to update announcement';
        this.loading = false;
        console.error('Error updating announcement:', error);
      }
    });
  }

  onDeleteAnnouncement(announcement: Announcement): void {
    if (confirm(`Are you sure you want to delete announcement "${announcement.title}"?`)) {
      this.loading = true;
      this.announcementsService.deleteAnnouncement(announcement.id).subscribe({
        next: () => {
          this.announcements = this.announcements.filter(a => a.id !== announcement.id);
          this.totalAnnouncements--;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to delete announcement';
          this.loading = false;
          console.error('Error deleting announcement:', error);
        }
      });
    }
  }

  onCancelForm(): void {
    this.showAnnouncementForm = false;
    this.editingAnnouncement = null;
    this.selectedFile = null;
    this.filePreview = null;
    document.body.style.overflow = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.filePreview = null;
  }

  addTag(tagInput: HTMLInputElement): void {
    const tag = tagInput.value.trim();
    const currentTags = this.announcementForm.get('tags')?.value || [];
    if (tag && !currentTags.includes(tag)) {
      this.announcementForm.patchValue({
        tags: [...currentTags, tag]
      });
      tagInput.value = '';
    }
  }

  removeTag(tag: string): void {
    const currentTags = this.announcementForm.get('tags')?.value || [];
    this.announcementForm.patchValue({
      tags: currentTags.filter((t: string) => t !== tag)
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalAnnouncements / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPriorityDisplayName(priority: string): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusDisplayName(isPublished: boolean): string {
    return isPublished ? 'Published' : 'Draft';
  }

  getStatusClass(isPublished: boolean): string {
    return isPublished ? 'status-published' : 'status-draft';
  }

  stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}