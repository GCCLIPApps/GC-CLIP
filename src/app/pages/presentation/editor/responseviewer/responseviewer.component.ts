import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-responseviewer',
  templateUrl: './responseviewer.component.html',
  styleUrls: ['./responseviewer.component.scss']
})
export class ResponseviewerComponent implements OnInit {

  constructor(   @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {

    console.log(this.data.msg)
  }

}
