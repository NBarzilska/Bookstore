import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})

export class BookEditComponent implements OnInit {
  editBookForm: FormGroup;
  errorMessage!: string;
  selectedImage: File | null = null; // Property to store the selected image file
  bookId!: string;
  imageUrl!: string; // Property to store the image URL

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.editBookForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0)]],
      // imageUrl: ['',[Validators.required, Validators.minLength(50)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookId = params['id'];
      // Fetch book information using the bookId and populate the form
      this.bookService.getBookById(this.bookId).subscribe(book => {
        this.imageUrl = 'http://localhost:3000/' + book.imageUrl; 
        this.editBookForm.patchValue({
          title: book.title,
          author: book.author,
          description: book.description,
          price: book.price
        });
      });
    });
  }

  onSubmit(): void {
    if (this.editBookForm.invalid) {
      Object.values(this.editBookForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    // Create a new FormData object to send data including the image
    const formData = new FormData();
    formData.append('title', this.editBookForm.value.title);
    formData.append('author', this.editBookForm.value.author);
    formData.append('description', this.editBookForm.value.description);
    formData.append('price', this.editBookForm.value.price);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    formData.append('owner', this.authService.getUserId());

    this.bookService.editBook(this.bookId, formData).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      error => {
        this.errorMessage = 'Failed to edit book. Please try again.';
        console.error(error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
