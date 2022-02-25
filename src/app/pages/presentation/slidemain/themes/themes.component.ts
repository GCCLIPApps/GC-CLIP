import { Component, OnInit, Inject, Optional, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';


export interface Tile {
  // backgroundimage: string;
  color:string;
  backgroundColor: string;
  name: string;
}

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {
  @Output() mainOutput : EventEmitter<any> = new EventEmitter<any>();

 
  currentTheme: any;

  isTheme = this._user.getPresentationTheme()


  tiles: Tile[] = [
    {name: 'GC CLIP Light',  backgroundColor: '#FFFFFF', color: '#1D2127'},
    {name: 'GC CLIP Nature', backgroundColor: '#48C9B0',color: '#FFFFFF'},
    {name: 'GC CLIP Lavender', backgroundColor: '#AF7AC5', color: '#FFFFFF'},
    {name: 'GC CLIP Dark', backgroundColor: '#1D2127', color: '#FFFFFF'},
    {name: 'GC CLIP Black Denim', backgroundColor: '#242a37 ', color:'#FFFFFF'}
  ];


  constructor( private _user: UserService) { }

  ngOnInit(): void {
    this.checkTheme(this.isTheme)
  }

  public checkTheme(background:any): boolean{

    return background === this.currentTheme
  }

  selectTheme(item:any){ 
    // console.log("clicked confirm",item)
    this.currentTheme = item.backgroundColor;
    this.isTheme = this.currentTheme
    this.mainOutput.emit(item);

  } 
    
}


