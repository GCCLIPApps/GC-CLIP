import { Component, OnInit,ViewChild } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector: 'app-rightclick',
  templateUrl: './rightclick.component.html',
  styleUrls: ['./rightclick.component.scss']
})
export class RightclickComponent implements OnInit {
  @ViewChild('basicMenu') contextMenu: ContextMenuComponent;

  constructor() { }

  ngOnInit() {
  }

  showMessage(message: any) {
    // console.log(message);
  }

}
