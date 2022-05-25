import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(public _socket: Socket) { }
  
  socketConnect(){
    this._socket.connect();
    // this._socket.fromEvent('set-id').subscribe(data =>{
      // console.log(data);
    // }) 
  }

  socketDisconnect(){
      this._socket.disconnect()
  }

  createRoom(room:any){
    this._socket.emit('create-room', room);
    this._socket.fromEvent('room-created').subscribe(data =>{
      // console.log(data);
    }) 
  }

  leaveRoom(room:any, user: string){
    this._socket.emit('leave-room', {room, user});
    this._socket.fromEvent('room-exited').subscribe(data =>{
      // console.log(data);
    }) 
  }
 

  sendData(data:any){
    this._socket.emit('send-data', data)
    // console.log(data)
    this._socket.fromEvent('data-recieved').subscribe(data =>{
      // console.log(data);
    }) 
  }

  sendTimerCountdown(data:any){
    this._socket.emit('send-timer', data)

    this._socket.fromEvent('timer-recieved').subscribe(data =>{
      // console.log(data);
    }) 
  }

  recievedData(){
    this._socket.fromEvent('recieved-student-response').subscribe(data =>{
      // console.log(data)
    });
  }
}
