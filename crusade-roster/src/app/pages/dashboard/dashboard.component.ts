import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { FactionService } from '../../services/faction.service';

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
  matchedLists: { id: string, name: string, faction: string, points: string, detachment: string }[] = [];
  crusadeLists: { id: string, name: string, faction: string, points: string, detachment: string }[] = [];

  constructor(private router: Router, private listService: ListService, private factionService: FactionService) {} // Inject the services

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
      this.listService.addList('crusade', this.listName, this.selectedFaction, this.selectedDetachment, points);
      this.loadLists(); // Reload lists to update the view
    } else {
      this.listService.addList('matched', this.listName, this.selectedFaction, this.selectedDetachment, points);
      this.loadLists(); // Reload lists to update the view
    }
    this.listName = ''; // Clear the input field after adding the list
    this.selectedFaction = ''; // Clear the faction selection after adding the list
    this.selectedDetachment = ''; // Clear the detachment selection after adding the list
    this.selectedPoints = '500'; // Reset the points selection after adding the list
    this.customPoints = null; // Clear the custom points input after adding the list
  }

  onFactionChange() {
    const selectedFaction = this.factionService.getFactions().find(f => f.name === this.selectedFaction);
    if (selectedFaction) {
      this.detachments = selectedFaction.detachments.map(detachment => detachment.name);
    } else {
      this.detachments = [];
    }
  }

  loadLists() {
    const lists = this.listService.getLists();
    this.matchedLists = lists.matched;
    this.crusadeLists = lists.crusade;
  }

  loadFactions() {
    this.factions = this.factionService.getFactions().map(f => f.name); // Get faction names
  }

  renameList(type: 'matched' | 'crusade', id: string) {
    const newName = prompt('Enter new name');
    if (newName) {
      this.listService.renameList(type, id, newName);
      this.loadLists(); // Reload lists to update the view
    }
  }

  deleteList(type: 'matched' | 'crusade', id: string) {
    this.listService.deleteList(type, id);
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
    return list.name;
  }

  getListFaction(list: { id: string, faction: string }): string {
    return list.faction;
  }

  getListPoints(list: { id: string, points: string }): string {
    return list.points;
  }

  getListDetachment(list: { id: string, detachment: string }): string {
    return list.detachment;
  }
}
