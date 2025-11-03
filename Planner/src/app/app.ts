import { Component, OnInit } from '@angular/core';
import { RouterEvent, RouterLink, RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './Components/Shared/header-component/header-component';
import { SideBarComponent } from './Components/Shared/side-bar-component/side-bar-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideBarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  constructor(public router: Router) {}
  protected title = 'Payment Planner';
  ngOnInit() {
    RouterEvent;
  }
}
