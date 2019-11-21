import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chat$: Observable<any>;
  newMsg: string;

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) { }

  ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    const chatId = this.route.snapshot.paramMap.get('chatId');
    const source = this.cs.get(roomId,chatId);
    this.chat$ = this.cs.joinUsers(source);
    console.log(roomId);
    console.log(chatId);
  } 

  submit(chatId) {
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
}

}
