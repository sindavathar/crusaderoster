import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crusade-list',
  templateUrl: './crusade-list.component.html',
  styleUrls: ['./crusade-list.component.css']
})
export class CrusadeListComponent implements OnInit {
  listName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.listName = this.route.snapshot.paramMap.get('name') || '';
  }
}
