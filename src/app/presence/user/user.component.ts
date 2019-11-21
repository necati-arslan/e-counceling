import { Component, OnInit, Input } from '@angular/core';
import { PresenceService } from '../services/presence.service';

@Component({
  selector: 'app-user', 
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 
  @Input() uid;

  presence$;
  constructor(private presence:PresenceService) { }

  ngOnInit() {

    this.presence$=this.presence.getPresence("CdceTHTS5we4TRsbYE7z8bDiZbx1");
    console.log(this.uid);
  } 

}
