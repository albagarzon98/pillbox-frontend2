import { NgModule } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser"; 
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

@NgModule({
    imports: [
        MatIconModule    ]
})
export class IconModule {
    private path: string = "../assets/images";

    constructor(
        private domSanitizer: DomSanitizer,
        public matIconRegistry: MatIconRegistry
    ) {
        this.matIconRegistry
        .addSvgIcon('pill-icon', this.setPath(`${this.path}/pill_icon.svg`))
        .addSvgIcon('pharmacy', this.setPath(`${this.path}/pharmacy_icon.svg`))
        .addSvgIcon('playStore', this.setPath(`${this.path}/svg_playStore.svg`))
        .addSvgIcon('mas', this.setPath(`${this.path}/mas.svg`))
    }

    private setPath (url:string): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    }
}