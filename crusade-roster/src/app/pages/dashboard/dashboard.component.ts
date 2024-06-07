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
  selectedFaction: string = ''; // Add a variable for selected faction
  selectedDetachment: string = ''; // Add a variable for selected detachment
  selectedPoints: string = '500'; // Add a variable for selected points with a default value
  customPoints: number | null = null; // Add a variable for custom points
  factions: string[] = []; // Add a variable to hold faction names
  detachments: string[] = []; // Add a variable to hold detachment names
  matchedLists: { id: string, name: string }[] = [];
  crusadeLists: { id: string, name: string }[] = [];

  constructor(private router: Router, private storageService: StorageService) {} // Inject the service

  ngOnInit() {
    this.loadLists();
    this.loadFactions(); // Load factions when component initializes
  }

  navigateTo(category: string) {
    this.router.navigate([`/${category}`]);
  }

  toggleListType() {
    this.listName = ''; // Clear the input field when toggling
    this.selectedFaction = ''; // Clear the faction selection when toggling
    this.selectedDetachment = ''; // Clear the detachment selection when toggling
    this.selectedPoints = '500'; // Reset the points selection when toggling
    this.customPoints = null; // Clear the custom points input when toggling
  }

  onAddList() {
    let points = this.selectedPoints === 'custom' && this.customPoints ? this.customPoints : this.selectedPoints;

    if (this.isCrusadeList) {
      this.storageService.addList('crusade', this.listName, this.selectedFaction, this.selectedDetachment, points);
      this.loadLists(); // Reload lists to update the view
    } else {
      this.storageService.addList('matched', this.listName, this.selectedFaction, this.selectedDetachment, points);
      this.loadLists(); // Reload lists to update the view
    }
    this.listName = ''; // Clear the input field after adding the list
    this.selectedFaction = ''; // Clear the faction selection after adding the list
    this.selectedDetachment = ''; // Clear the detachment selection after adding the list
    this.selectedPoints = '500'; // Reset the points selection after adding the list
    this.customPoints = null; // Clear the custom points input after adding the list
  }

  onFactionChange() {
    const selectedFaction = this.storageService.getFactions().find(f => f.name === this.selectedFaction);
    if (selectedFaction) {
      this.detachments = selectedFaction.detachments;
    } else {
      this.detachments = [];
    }
  }

  loadLists() {
    const lists = this.storageService.getLists();
    this.matchedLists = lists.matched;
    this.crusadeLists = lists.crusade;
  }

  loadFactions() {
    this.factions = this.storageService.getFactions().map(f => f.name); // Get faction names
  }

  renameList(type: 'matched' | 'crusade', index: number) {
    const newName = prompt('Enter new name');
    if (newName) {
      this.storageService.renameList(type, index, newName);
      this.loadLists(); // Reload lists to update the view
    }
  }

  deleteList(type: 'matched' | 'crusade', index: number) {
    this.storageService.deleteList(type, index);
    this.loadLists(); // Reload lists to update the view
  }

  viewList(type: string, id: string) {
    if (type === 'crusade') {
      this.router.navigate([`/crusade-list/${id}`]);
    } else {
      this.router.navigate([`/matched-list/${id}`]);
    }
  }

  getListName(list: { id: string, name: string }): string {
    return list.name.split('|')[0];
  }

  getListDetachment(list: { id: string, name: string }): string {
    return list.name.split('|')[1];
  }
}
