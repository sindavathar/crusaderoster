import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-matched-list',
  templateUrl: './matched-list.component.html',
  styleUrls: ['./matched-list.component.css']
})
export class MatchedListComponent implements OnInit {
  listName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.listName = this.route.snapshot.paramMap.get('name') || '';
  }
}
