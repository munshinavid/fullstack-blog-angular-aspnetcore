import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogImage, ImageSelectorService } from '../../services/image-selector-service';

@Component({
  selector: 'app-image-selector',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector implements OnInit {

  @Output() imageSelected = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  // 🔹 Signals
  images = signal<BlogImage[]>([]);
  isUploading = signal(false);

  selectedFile: File | null = null;
  fileName = '';
  title = '';

  constructor(private imageService: ImageSelectorService) {}

  // 🔥 Load gallery
  ngOnInit() {
    this.imageService.getAll().subscribe({
      next: (res) => this.images.set(res),
      error: (err) => console.error('Load images failed', err)
    });
  }

  // 🔹 Select existing image
  selectImage(url: string) {
    this.imageSelected.emit(url);
  }

  // 🔹 File change
  onFileUploadChange(event: any) {
    console.log('File selected:', event.target.files);
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // auto fill name if empty
    if (!this.fileName) {
      this.fileName = file.name;
    }
  }

  // 🔥 Upload new image
  uploadImage() {
    if (!this.selectedFile) return;

    this.isUploading.set(true);

    this.imageService.upload(this.selectedFile, this.fileName, this.title)
      .subscribe({
        next: (url) => {
          this.isUploading.set(false);

          // 👉 gallery refresh (important)
          this.refreshImages();

          // 👉 auto select uploaded image
          this.imageSelected.emit(url);
        },
        error: (err) => {
          this.isUploading.set(false);
          console.error('Upload failed', err);
        }
      });
  }

  // 🔹 Refresh gallery
  private refreshImages() {
    this.imageService.getAll().subscribe({
      next: (res) => this.images.set(res)
    });
  }

  // 🔹 Close modal
  close() {
    this.closeModal.emit();
  }

}
