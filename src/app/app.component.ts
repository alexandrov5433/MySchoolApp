import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/header/header.component";
import { MainComponent } from "./core/main/main.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MySchoolApp';
}
