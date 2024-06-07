import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isCrusadeList: boolean = false; // Default to 'Matched'
  listName: string = '';
  matchedLists: string[] = [];
  crusadeLists: string[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadLists();
  }

  navigateTo(category: string) {
    this.router.navigate([`/${category}`]);
  }

  toggleListType() {
    this.listName = ''; // Clear the input field when toggling
  }

  onAddList() {
    const localLists = localStorage.getItem('angular17lists');
    let lists: { matched: string[]; crusade: string[] } = { matched: [], crusade: [] };

    if (localLists != null) {
      lists = JSON.parse(localLists);
    }

    if (this.isCrusadeList) {
      lists.crusade.push(this.listName);
      this.crusadeLists.push(this.listName);
    } else {
      lists.matched.push(this.listName);
      this.matchedLists.push(this.listName);
    }

    localStorage.setItem('angular17lists', JSON.stringify(lists));
    this.listName = ''; // Clear the input field after adding the list
  }

  loadLists() {
    const localLists = localStorage.getItem('angular17lists');
    if (localLists != null) {
      const lists = JSON.parse(localLists);
      this.matchedLists = lists.matched || [];
      this.crusadeLists = lists.crusade || [];
    }
  }

  renameList(type: string, index: number) {
    const newName = prompt('Enter new name');
    if (newName) {
      if (type === 'crusade') {
        this.crusadeLists[index] = newName;
      } else {
        this.matchedLists[index] = newName;
      }
      this.updateLocalStorage();
    }
  }

  deleteList(type: string, index: number) {
    if (type === 'crusade') {
      this.crusadeLists.splice(index, 1);
    } else {
      this.matchedLists.splice(index, 1);
    }
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    const lists = {
      matched: this.matchedLists,
      crusade: this.crusadeLists
    };
    localStorage.setItem('angular17lists', JSON.stringify(lists));
  }

  viewList(type: string, name: string) {
    if (type === 'crusade') {
      this.router.navigate([`/crusade-list/${name}`]);
    } else {
      this.router.navigate([`/matched-list/${name}`]);
    }
  }
}
