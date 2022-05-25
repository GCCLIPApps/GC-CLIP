import { AfterViewInit,Inject, Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit,AfterViewInit {
  @Output() imageEmit : EventEmitter<any> = new EventEmitter<any>();

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  id: any;
  selectedImage: any;
  constructor(    @Inject(MAT_DIALOG_DATA) private data: any,) { 

    if(data.id){
      this.id = data.id
    }
  }

  ngOnInit(): void {
 
  }
  
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }

  openUpload(){
      document.getElementById("fileupload")?.click();
  }

  fileChanged(e:any) {
    const file = <File>e.target.files[0];
    this.showCropper = true;
    this.imageChangedEvent = e;
    // this.getBase64(file);

  }
    
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      // console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
      this.showCropper = true;
      // console.log('Image loaded');
  }

  submitImage(){
    console.log()
    this.imageEmit.emit({image: this.croppedImage, id: this.id});
    this.id =''
  }
  
}
