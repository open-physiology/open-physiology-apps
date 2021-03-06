/**
 * Created by Natallia on 4/9/2017.
 */
import {Component, ViewChild, EventEmitter, Input, Output} from '@angular/core';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {model} from "../common/utils.model";

@Component({
  selector: 'modal-window',
  inputs: ['item'],
  template:`
      <modal #myModal>
        <modal-header [show-close]="true">
            <h4 class="modal-title">Select supertype measurables to replicate</h4>
        </modal-header>
        <modal-body>
            <li *ngFor="let option of supertypeMeasurables; let i = index">
              <a class="small" href="#">
              <input type="checkbox" 
                [(ngModel)]="option.selected" 
                (ngModelChange)="measurablesToReplicateChanged(option)"/>&nbsp;
              {{option.value.name}}</a>
            </li>
        </modal-body>
        <modal-footer>
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" (click)="close($event)">Ok</button>
        </modal-footer>
      </modal>
  `,
  directives: [MODAL_DIRECTIVES]
})
export class ModalWindow{
  @Input()  item: any;
  @Output() closed = new EventEmitter();

  //Measurable replication
  supertypeMeasurables : Array <any> = [];
  measurablesToReplicate: Set<any> = new Set<any>();

  @ViewChild('myModal')
  modal: ModalComponent;

  public generateMeasurables() {
    let allSupertypeMeasurables = [];
    for (let type of this.item.types) {
      for (let supertype of type.supertypes) {
        if (supertype.definition && supertype.definition.measurables) {
          let supertypeMeasurables = Array.from(new Set(supertype.definition.measurables.map((item:any) => item.type)));
          for (let supertypeMeasurable of supertypeMeasurables) {
            if (allSupertypeMeasurables.indexOf(supertypeMeasurable) < 0)
              allSupertypeMeasurables.push(supertypeMeasurable);
          }
        }
      }
    }
    this.supertypeMeasurables = allSupertypeMeasurables.map(x => {
      return {value: x, selected: this.measurablesToReplicate.has(x)}
    });
    this.modal.open();
  }

  close(event) {
    if (this.measurablesToReplicate.size > 0){
      let protoMeasurables = Array.from(this.measurablesToReplicate);
      for (let protoMeasurable of protoMeasurables){
        let newMeasurable = model.Measuarable.new(protoMeasurable);
        newMeasurable.location = this.item;
      }
    }
    this.modal.close();
    this.closed.emit(event);
  }

  measurablesToReplicateChanged(option: any){
    if ( this.measurablesToReplicate.has(option.value) && !option.selected)
      this.measurablesToReplicate.delete(option.value);
    if (!this.measurablesToReplicate.has(option.value) && option.selected)
      this.measurablesToReplicate.add(option.value);
  }

}
