import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service'; // Import the service

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

  constructor(private router: Router, private storageService: StorageService) {} // Inject the service

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
    if (this.isCrusadeList) {
      this.storageService.addList('crusade', this.listName);
      this.crusadeLists.push(this.listName);
    } else {
      this.storageService.addList('matched', this.listName);
      this.matchedLists.push(this.listName);
    }
    this.listName = ''; // Clear the input field after adding the list
  }

  loadLists() {
    const lists = this.storageService.getLists();
    this.matchedLists = lists.matched;
    this.crusadeLists = lists.crusade;
  }

  renameList(type: 'matched' | 'crusade', index: number) {
    const newName = prompt('Enter new name');
    if (newName) {
      this.storageService.renameList(type, index, newName);
      if (type === 'crusade') {
        this.crusadeLists[index] = newName;
      } else {
        this.matchedLists[index] = newName;
      }
    }
  }

  deleteList(type: 'matched' | 'crusade', index: number) {
    this.storageService.deleteList(type, index);
    if (type === 'crusade') {
      this.crusadeLists.splice(index, 1);
    } else {
      this.matchedLists.splice(index, 1);
    }
  }

  viewList(type: string, name: string) {
    if (type === 'crusade') {
      this.router.navigate([`/crusade-list/${name}`]);
    } else {
      this.router.navigate([`/matched-list/${name}`]);
    }
  }
}
