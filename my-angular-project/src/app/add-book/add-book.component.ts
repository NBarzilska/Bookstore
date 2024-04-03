import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BookService } from '../book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  addBookForm: FormGroup;
  errorMessage!: string;
  selectedImage: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private bookService: BookService,
    private router: Router
  ) {
    this.addBookForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]], 
      author: ['', [Validators.required, Validators.maxLength(50)]], 
      description: ['', [Validators.required,Validators.maxLength(500)]], 
      price: ['', [Validators.required, Validators.min(0)]],
      // imageUrl: ['',[Validators.required, Validators.minLength(50)]]
    });
  }

  onSubmit(): void {
    console.log('SUBMIT');
    if (this.addBookForm.invalid) {
      Object.values(this.addBookForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    // Create a new FormData object to send data including the image
    const formData = new FormData();
    formData.append('title', this.addBookForm.value.title);
    formData.append('author', this.addBookForm.value.author);
    formData.append('description', this.addBookForm.value.description);
    formData.append('price', this.addBookForm.value.price);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    formData.append('owner', this.authService.getUserId());

    // Send the form data to the book service
    this.bookService.addBook(formData).subscribe(
      () => {
        this.router.navigate(['/home']); // Redirect to home page after successfully adding the book
      },
      error => {
        this.errorMessage = 'Failed to add book. Please try again.';
        console.error(error);
      }
    );
  }

  onFileSelected(event: any): void {
    // Get the selected file
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file; // Store the selected image file
    }
  }
}
