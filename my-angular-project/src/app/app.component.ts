import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{
  title='my-angular-project';

  constructor() {
  }
  
  ngOnInit(): void {
   
  }
  
}