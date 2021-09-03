import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ) { 
    this.matIconRegistry.addSvgIcon(
      'pill_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/pill_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'pharmacy',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/pharmacy_icon.svg")
    );
  }

  title = 'PillBox-FrontEnd';
}
