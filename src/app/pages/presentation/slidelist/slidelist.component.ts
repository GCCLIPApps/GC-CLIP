import { Component, OnInit, ViewChild, HostListener, Input, Output, EventEmitter} from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../home/dashboard/confirmation-dialog/confirmation-dialog.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-slidelist',
  templateUrl: './slidelist.component.html',
  styleUrls: ['./slidelist.component.scss']
})
export class SlidelistComponent implements OnInit { 
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @ViewChild(MatMenuTrigger)contextMenu: MatMenuTrigger;
  @Output() totalSelectAnswerPage: EventEmitter<any> = new EventEmitter<any>();
  contextMenuPosition = { x: '0px', y: '0px' };

  @Input() id: number;
  @Input() slideTimer: number;
  @Input() sTheme:string = this._user.getPresentationTheme();
  @Input() sColor: string = this._user.getPresentationFontColor();
  @Input() sImage: string = this._user.getPresentationFontColor();

  newslideTimer: number;
  sType: string

  fullname: string; 
  department: string;
  items: any = ['1','2','3'];
  currentIndex: number = 0;
  lastslide: boolean = false
  oldIndex = 0;
  public currentlyClickedCardIndex: number = 0;
  public isDisabled: boolean = false;

  @Output() slidespercent: EventEmitter<any> = new EventEmitter<any>();
  min: number;
  percent: number;

  constructor(
    private _snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private _router: Router,
    private _socket: SocketService,
    private _ds: DataService, 
    public _user: UserService) { 


    }

  ngOnInit(): void {
  // this.fullname = this._user.getFullname();
  // this.department = this._user.getDept();
 

  this.getSlidelist();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // clearTimeout(this.emitters())
  }

  ngOnChanges(changes: any): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // this.slideTimer = changes.slideTimer.currentValue;
    
  }

  showMessage(message: any) {
  }

  getSlidelist(){
    console.log(this.id, this.slideTimer)
    this._ds.processData1('slides/pres/bySlideId', this.id, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      // console.log(load)
      this.items = load;
      this.slideSelector(load[0], 0);
      this._user.getSlideId();
      this.min = 100 / this.items.length;
      this.percent = this.min;
      this.slidespercent.emit({percent: this.percent, slidetype: this.items})
      },err =>{
        console.log('err', err)
      });



  }
  

  addSlide(){
    let length = (this.items.length -1) + 1;
 
    this._ds.processData1('slides/pres/createSlide', 
    {sId: this._user.getPresentationId(), 
    sNo_fld: length
    }, 2)?.subscribe((res: any) => {
      let load = this._ds.decrypt(res.d);
      this.DisabledInput();
      this.items.push(load);
      this.slideSelector(load, length);
      this. progressIndex(length);
      this._user.setSlideDetails(load.id, load.sNo_fld,load.sType_fld);
      },err =>{
        console.log('err', err)
      });
  }

  updateIndex(index: any){
    console.log(index)
  }


  public checkIfCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedCardIndex;
  }

  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }



  @HostListener('window:keydown', ['$event'],)

  //  Next and Previous slide
  // Arrow Keys Event Return Progress Bar
  selectionChange(event:any) {

    if(event.key == "ArrowRight"){
      this.currentIndex++;

        if(this.currentIndex == this.items.length){
            this.currentIndex = 0;
            this.percent -=  this.min * this.items.length;
            console.log('This is the last slide')
          // this._socket.sendData({sdId: this._user.getSlideId(),index: this.currentIndex, room: this._user.getPresentationCode()})
        }
          this.slideSelector(this.items[this.currentIndex], this.currentIndex);
          this.percent += this.min;
        
    }
      if(event.key == "ArrowLeft"){
        this.currentIndex--;

          if(this.currentIndex < 0){
            this.currentIndex = this.items.length - 1;
            this.percent = this.min * this.items.length;

            // this._socket.sendData({slideDetail: this._user.getSlideId(),index: this.currentIndex, room: this._user.getPresentationCode()})
          }else{
            this.percent -= this.min;
            // this.slideSelector(this.items[this.currentIndex = 0], this.currentIndex = 0)
          }
          this.slideSelector(this.items[this.currentIndex], this.currentIndex);
    }
    this.slidespercent.emit({percent: this.percent})
  }

  
  // Click Event Return Progress Bar
  progressIndex(index: any){
    
    if(this.oldIndex < index) {
        if(index == this.items.length){
     
            this.percent = 100;
        }else{

           this.percent += (this.min * index);
        }
    }

    if(this.oldIndex > index){
      if(index == 0){
        this.percent = (100 / this.items.length);

      }else{
        this.percent = (this.min *(this.items.length - index)) ;
      }
    }
    this.oldIndex = index 
    this.slidespercent.emit({percent: this.percent})
  }

  
  slideSelector(item: any, index: any){
    this.currentlyClickedCardIndex = index;
    this._user.setSlideDetails(item.id, item.sNo_fld,item.sType_fld);
    this._user.SubjectSlideId()
  }


  openDeleteDialog(item:any, index: number) {
    console.log(item)
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent,{
      data:{
        item: item,
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.DisabledInput();
        this.items.splice(index, 1);
        this.slideSelector(this.items[0], index)
          this._snackBar.open("Slide Deleted", '', {
            duration: 2000,
          });
      }
    });
  }
  onContextMenu(event: MouseEvent, item:any, i:any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item, 'i':i}
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  updateType(type: any){
    for (var i = 0; i < this.items.length; i++){
      if (this._user.getSlideId() == this.items[i].id ){
          this.items[i].sType_fld = type;
          break;
      }
    }
  }

  
  DisabledInput(){
    this.isDisabled = true;
    setTimeout(() =>{
      this.isDisabled = false;
    }, 1000);
  }
  
  home(){
    this._router.navigate(['/main']);
  }
}
