import { Component, EventEmitter, OnInit, Output, OnDestroy, ViewChild,Optional} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import {MatDialog, MatDialogConfig,MatDialogRef} from '@angular/material/dialog';

import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { SocketService } from 'src/app/services/socket.service';
import { AddstudentsComponent } from './addstudents/addstudents.component';

export interface Viewers {
  image_fld: string;
  emailadd_fld: string;
  updatedOn: string;
  createdOn: string;
}

@Component({
  selector: 'app-rightnav',
  templateUrl: './rightnav.component.html',
  styleUrls: ['./rightnav.component.scss']
})
export class RightnavComponent implements OnInit{
  @Output() contentData: EventEmitter<any> = new EventEmitter<any>();
  @Output() Pace: EventEmitter<any> = new EventEmitter<any>();
  @Output() Assignto: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns: string[] = ['image_fld', 'emailadd_fld'];
  dataSource = new MatTableDataSource<Viewers>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  SubjectslideId: Subscription;
  SubjectpresPace: Subscription;
  SubjectpresAssign: Subscription;

  loadingBar: boolean = false;

  currentTabIndex = 1
  contentTabs: string = '';
  items: any;
  toggleLanguagechecked: boolean = true;
  isDisabled: boolean = false;
  currentlyClickedCardIndex: any;
  step: number = 0;
  
  toggleisAssignedto: string ;
  isPaceTo: number;
  viewers: any = [];

  // Content Variables
  heading: string = '';
  subheading: string = '';

  // PointsTimer
  points: number;
  timer: number = 30;
  toggleExtrapoints: boolean = true;

  // Image
  newImage: any;
  image: any;
  selectedImage: any;
  selectedoptionImage:any;

  // Options
  Options: any;
  optionLists: any;
  optionImage: any;
 

  constructor(
    @Optional() public MatDialogRef: MatDialogRef<ImageCropperComponent>,
    private matDialog: MatDialog,
    public _user: UserService, 
    private _ds: DataService) { }
    
    ngOnInit():void {

      this.SubjectslideId =  this._user.SubjectslideId?.subscribe((data) => {
      this._ds.processData1('slides/pres/byOneSlideId', {sdId: data}, 2)?.subscribe((res: any) => {
        let load = this._ds.decrypt(res.d);
        this.contentTabs = load[0]["sType_fld"];
       
        if(this.contentTabs == '' && load[0]["sNo_fld"] == ''){
          this.currentTabIndex = 0
          this.selectType(this.contentTabs);
        }else{
          this.selectType(this.contentTabs)
        }
   
        },err =>{
          // console.log('err', err)
        });     
      });

      this.SubjectpresPace = this._user.SubjectpresPace?.subscribe((data) => {

        this.isPaceTo = data;

      })

 
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
 

  }

  DisabledInput(){
    this.isDisabled = true;
    setTimeout(() =>{
      this.isDisabled = false;
    }, 2000);
  }
  
  setStep(index: number) {
    this.step = index;
  }

  public checkIfCardIsSelected(cardIndex: string): boolean {
    return cardIndex === this.currentlyClickedCardIndex;
  }

  istabDisable = true;

  onTabChange(event: any) {
    if(event.index != 0){
      this.istabDisable = false;
    }
    this.currentTabIndex = event.index;
    return this.currentTabIndex
  }


  
  selectType(msg: string){
    this.currentlyClickedCardIndex = msg;

    switch (msg){
      // Content Slides
      case 'heading':
        this.updateSlideType(msg);
  
      break;
 
      case 'paragraph':
        this.updateSlideType(msg);
  
      break;
      
      case 'bullets':
        this.getOptions();
        this.updateSlideType(msg);
 
      break;

      // Quiz Competition
      case 'quiz':
        this.getOptions();
        this.updateSlideType(msg);
      break;

      case 'identification':
        this.getOptions();
        this.updateSlideType(msg);
      break;

      //Popular  Question type
      case 'qa':
        this.updateSlideType(msg);
      break;

      case 'poll':
        this.getOptions();
        this.updateSlideType(msg);
      break;

      case 'mc':
        this.getOptions();
        this.updateSlideType(msg);
      break;
      
      default:
        this.currentTabIndex = 0
        this.istabDisable = true;
        this.updateContent('')
    }
  }
  

  updateSlideType(type: string){
    this.loadingBar = true;

    this.toggleisAssignedto = this._user.getPresentationAssignto()   

    this._ds.processData1('slides/pres/'+this._user.getSlideId(),{sType_fld: type}, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.currentTabIndex = 1
      this.contentTabs = type;

      if(load['id']){
        this.heading = 'Slide with heading',this.subheading = '';
        this._user.setContentDetails(load['id'])
      }else{
        this._user.setContentDetails(load[0]['id'])
        this.heading = load[0]['heading_fld'];
        this.subheading = load[0]['subheading_fld'];
        this.image = load[0]['image_fld'];
        this.points = load[0]['points_fld'];
        this.toggleExtrapoints = load[0]['isextrapoints_fld'];
        this.timer = load[0]['timer_fld'];
      }
      
      this.updateContent(type);
      this.loadingBar = false;

      },err =>{
        // console.log('err', this._ds.decrypt(err.d))
      });
  }

  
  // Method for Options
  getOptions(){
      let path = 'option/getOptions'
      if(this.currentlyClickedCardIndex == 'poll'){
        path = 'poll/getPolls'
      }
      
      this._ds.processData1(path,this._user.getSlideId(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log(load)
      this.optionLists = load;
      this.DisabledInput();
      },err =>{
        // console.log('err', this._ds.decrypt(err.d))
      });
  }

  addOptions(){

    let path = 'option/addOptions'
    if(this.currentlyClickedCardIndex == 'poll'){
      path = 'poll/addPolls'
    }

    this._ds.processData1(path,this._user.getSlideId(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.optionLists.push({id: load})
      this.DisabledInput();
      },err =>{
        // console.log('err', this._ds.decrypt(err.d))
      });
  } 

  updateOption(id:any, type:any,optionTitle: any){
    this.Options = optionTitle.target.value;

    let path = `option/updateOptions/${id}`
    let option = {option:  this.Options}
    if(this.currentlyClickedCardIndex == 'poll'){
      path = `poll/updatePolls/${id}`
    }

    this._ds.processData1(path, option, 2)?.subscribe((res: any) => {
      this.DisabledInput();
      },err =>{
        // console.log('err', err)
      });
  }

  isCorrect(id:number, type:any, isCorrect : any){
    this._ds.processData1('option/updateOptions/'+id,{isCorrect: isCorrect.checked}, 2)?.subscribe((res: any) => {
      this.DisabledInput();
      },err =>{
        // console.log('err', err)
      })
  }

  removeOptions(id:number, index:number){

    let path = `option/removeOptions/id/${id}`

    if(this.currentlyClickedCardIndex == 'poll'){
      path = `poll/removePolls/id/${id}`
    }

    this._ds.processData1(path,'', 2)?.subscribe((res: any) => {
      this.optionLists.splice(index, 1)
      this.DisabledInput();
      },err =>{
        // console.log('err', err)
      });
  }


 // Emits Data to Editor Page
 updateContent(type: any){
  let newType = type
  let contentForm ={
    "heading": this.heading,
    "subheading": this.subheading,
    "image": this.image,
    "selectedImage": this.selectedImage,
    "timer": this.timer,
    "point": this.points,
    "isextrapoints": this.toggleExtrapoints
  }
  // console.log(contentForm)
  this.DisabledInput();
  
  this.contentData.emit({contentForm, newType, options: this.optionLists})
}

// Image Function
openCropper(id:any){
  
  let dialogConfig = this.matDialog.open(ImageCropperComponent,{
    width: '60%', height:'400px',
    data:{
      id: id,
      buttonText: {
        ok: 'Save',
        cancel: 'No'
      }
    }
  });

  dialogConfig.componentInstance.imageEmit.subscribe((result) => {
    
    let url = result.image
    fetch(url)
    .then(res => res.blob())
    .then(blob => {
      if(result.id){
  
        this.newImage = blob
        this.updateOptionImage(result.id)
      }
      if(result.id == undefined){

        this.newImage = blob
        this.uploadImage()
      }
    })
  });
}

updateOptionImage(id:any){
  const fd = new FormData();

  fd.append('image', this.newImage);
  
  // console.log(id, fd.get('image'))
  this._ds.processData1('upload/option/'+id, fd , 3)?.subscribe((res: any) => {
    let load = this._ds.decrypt(res.d);
    this.DisabledInput();

    for (var i = 0; i < this.optionLists.length; i++){
      if (id == this.optionLists[i].id ){
          this.optionLists[i].image_fld = load;
          break;
      }
    }
    this.updateContent(this.contentTabs);
    },err =>{
      // console.log('err', err)
    });
}


removeOptionImage(id:number){
  // console.log(id)
  this._ds.processData1('option/updateOptions/'+id,'', 2)?.subscribe((res: any) => {
    this.DisabledInput();

    for (var i = 0; i < this.optionLists.length; i++){
      if (id == this.optionLists[i].id ){
          this.optionLists[i].image_fld = ''
          break;
      }
    }

    },err =>{
      // console.log('err', err)
    })
}

uploadImage(){
  const fd = new FormData();
  fd.append('image', this.newImage);
  this._ds.processData1('upload/content/'+ this._user.getContentId(), fd, 3)?.subscribe((res: any) => {
    let load = this._ds.decrypt(res.d);
    this.image = load;
    this.updateContent(this.contentTabs);
    },err =>{
      // console.log('err', err)
    });
}

  removeImage(){
    this._ds.processData1('contents/update/'+ this._user.getContentId(), '', 2)?.subscribe((res: any) => {
      this.image = null;
      this.DisabledInput();
      this.updateContent(this.contentTabs);
      },err =>{
        // console.log('err', err)
      });
  }

  checkViewers(){
    this._ds.processData1('history/getSlideViewer', this._user.getPresentationId(), 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log('viewer',load);
      this.viewers = load
      this.dataSource = new MatTableDataSource(load); 
      this.dataSource.sort = this.sort;
      },err =>{
        // console.log('err', err)
      });``
  }

  updatePace(pace:number){
  
    this.Pace.emit({pace: pace, toggleAssign: this.toggleisAssignedto })
  }

  openAddStudents(status: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    let dialogRef = this.matDialog.open(AddstudentsComponent,{
      width: '50%', height:'auto',
      data: {
        status: status
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {

      }
    });

  }
 
}

