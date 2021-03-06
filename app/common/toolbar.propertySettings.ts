/**
 * Created by Natallia on 6/19/2016.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DROPDOWN_DIRECTIVES} from "ng2-dropdown";
import {RADIO_GROUP_DIRECTIVES} from "ng2-radio-group";
import {Draggable} from "./directive.draggable";

@Component({
  selector: 'toolbar-propertySettings',
  inputs: ['options', 'transform'],
  template: `
    <div class="dropdown pull-right" dropdown>
      <button type="button" class="btn btn-default btn-icon"  dropdown-open>
        <span class="glyphicon glyphicon-list"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-right" dropdown-not-closable-zone draggable>
        <li *ngFor="let option of options">
          <a class="small" href="#"><input type="checkbox"
          [(ngModel)]="option.selected" (ngModelChange)="selectionChanged.emit(option)"/>&nbsp;
          <span [style.color]="option.color">{{transform? transform(option.value): option.value}}</span>
          </a>
        </li>
      </ul>
    </div>
    `,
  directives:[DROPDOWN_DIRECTIVES, RADIO_GROUP_DIRECTIVES, Draggable]
})
export class ToolbarPropertySettings {
  @Output() selectionChanged = new EventEmitter();
}

@Component({
  selector: 'toolbar-customSettings',
  inputs: ['options', 'caption'],
  template: `
    <div class="dropdown" dropdown>
      <button type="button" class="btn btn-default btn-icon" dropdown-open>
        {{caption}} <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" dropdown-not-closable-zone>
        <li *ngFor="let option of options; let i = index">
          <a class="small" href="#"><input type="checkbox" 
          [(ngModel)]="option.selected" (ngModelChange)="selectionChanged.emit(option)"/>&nbsp;{{option.value}}</a>
        </li>
      </ul>
    </div>
    `,
  styles: [':host {float: left;}'],
  directives:[DROPDOWN_DIRECTIVES, RADIO_GROUP_DIRECTIVES]
})
export class ToolbarCustomSettings {
  @Output() selectionChanged = new EventEmitter();
}
