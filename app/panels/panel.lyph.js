"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by Natallia on 6/17/2016.
 */
var core_1 = require('@angular/core');
var panel_template_1 = require("./panel.template");
var component_select_1 = require('../components/component.select');
var pipe_general_1 = require("../transformations/pipe.general");
var panel_border_1 = require("./panel.border");
var component_templateValue_1 = require('../components/component.templateValue');
var repo_nested_1 = require("../repos/repo.nested");
var utils_model_1 = require("../services/utils.model");
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var LyphPanel = (function (_super) {
    __extends(LyphPanel, _super);
    function LyphPanel() {
        _super.apply(this, arguments);
        this.saved = new core_1.EventEmitter();
        this.canceled = new core_1.EventEmitter();
        this.removed = new core_1.EventEmitter();
        this.propertyUpdated = new core_1.EventEmitter();
        this.highlightedItemChange = new core_1.EventEmitter();
        this.borderOptions = { 'readOnly': true, 'hideRemove': true, 'hideCreateType': true };
        this.layersIgnore = new Set();
        this.patchesIgnore = new Set();
        this.partsIgnore = new Set();
        this.segmentsIgnore = new Set();
        //Measurable replication
        this.supertypeMeasurables = [];
        this.measurablesToReplicate = new Set();
    }
    LyphPanel.prototype.ngOnInit = function () {
        this.custom = new Set([
            'thickness', 'length',
            'axis', 'radialBorders', 'longitudinalBorders']);
        _super.prototype.ngOnInit.call(this);
        if (!this.item.axis) {
            this.ignore.add('axis');
        }
        this.layersIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers']);
        this.patchesIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers']);
        this.partsIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers']);
        this.segmentsIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers']);
    };
    LyphPanel.prototype.generateMeasurables = function () {
        var _this = this;
        var allSupertypeMeasurables = [];
        for (var _i = 0, _a = this.item.types; _i < _a.length; _i++) {
            var type = _a[_i];
            for (var _b = 0, _c = type.supertypes; _b < _c.length; _b++) {
                var supertype = _c[_b];
                if (supertype.definition && supertype.definition.measurables) {
                    var supertypeMeasurables = Array.from(new Set(supertype.definition.measurables.map(function (item) { return item.type; })));
                    for (var _d = 0, supertypeMeasurables_1 = supertypeMeasurables; _d < supertypeMeasurables_1.length; _d++) {
                        var supertypeMeasurable = supertypeMeasurables_1[_d];
                        if (allSupertypeMeasurables.indexOf(supertypeMeasurable) < 0)
                            allSupertypeMeasurables.push(supertypeMeasurable);
                    }
                }
            }
        }
        this.supertypeMeasurables = allSupertypeMeasurables.map(function (x) { return { value: x, selected: _this.measurablesToReplicate.has(x) }; });
        this.modal.open();
    };
    LyphPanel.prototype.close = function () {
        if (this.measurablesToReplicate.size > 0) {
            var protoMeasurables = Array.from(this.measurablesToReplicate);
            for (var _i = 0, protoMeasurables_1 = protoMeasurables; _i < protoMeasurables_1.length; _i++) {
                var protoMeasurable = protoMeasurables_1[_i];
                var newMeasurable = utils_model_1.model.Measuarable.new(protoMeasurable);
                newMeasurable.location = this.item;
            }
        }
    };
    LyphPanel.prototype.measurablesToReplicateChanged = function (option) {
        if (this.measurablesToReplicate.has(option.value) && !option.selected)
            this.measurablesToReplicate.delete(option.value);
        if (!this.measurablesToReplicate.has(option.value) && option.selected)
            this.measurablesToReplicate.add(option.value);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LyphPanel.prototype, "saved", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LyphPanel.prototype, "canceled", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LyphPanel.prototype, "removed", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LyphPanel.prototype, "propertyUpdated", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LyphPanel.prototype, "highlightedItemChange", void 0);
    __decorate([
        core_1.ViewChild('myModal'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], LyphPanel.prototype, "modal", void 0);
    LyphPanel = __decorate([
        core_1.Component({
            selector: 'lyph-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <template-panel [item]=\"item\" \n        [ignore]  = \"ignore\"\n        [options] = \"options\"\n        [custom]  = \"custom\" \n        (saved)   = \"saved.emit($event)\"\n        (canceled)= \"canceled.emit($event)\"\n        (removed) = \"removed.emit($event)\"\n        (propertyUpdated) = \"propertyUpdated.emit($event)\" \n        (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n        \n        <toolbar>\n          <button type=\"button\" class=\"btn btn-default btn-icon\" \n            (click)=\"generateMeasurables()\">\n            <span class=\"glyphicon glyphicon-cog\"></span>\n          </button>\n        </toolbar>\n        \n        <!--Thickness, Length-->\n        <sizeGroup *ngFor = \"let property of ['thickness', 'length']\">\n          <template-value *ngIf=\"includeProperty(property)\" \n            [caption]=\"getPropertyLabel(property)\" \n            [item]=\"item.p(property) | async\"\n            (updated)=\"updateProperty(property, $event)\">\n          </template-value>\n        </sizeGroup>\n        \n        <fieldset *ngIf=\"includeProperty('borders')\" >  \n          <legend>Borders</legend>\n          \n          <!--Axis-->\n          <div class=\"input-control\" *ngIf=\"item.axis\">      \n            <label for=\"axis\">{{getPropertyLabel('axis')}}: </label>\n            <border-panel [item]=\"item.p('axis') | async\" \n              [options]=\"borderOptions\"\n              (propertyUpdated) = \"propertyUpdated.emit($event)\" \n              (highlightedItemChange)=\"highlightedItemChange.emit($event)\"\n              (saved)  = \"updateProperty('axis', $event)\">\n            </border-panel>\n          </div>              \n        \n          <borderGroup *ngFor=\"let property of ['radialBorders', 'longitudinalBorders']\">\n            <div class=\"input-control\" *ngIf=\"item[property]\">      \n              <repo-nested [caption]=\"getPropertyLabel(property)\" \n                 [items]  = \"item.p(property) | async | setToArray\" \n                 [types]  = \"getTypes(property)\" \n                 [options] = \"borderOptions\"\n                 (updated) = \"updateProperty(property, $event)\"\n                 (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n              </repo-nested>\n            </div>\n          </borderGroup>\n        </fieldset>\n        \n        <modal #myModal>\n          <modal-header [show-close]=\"true\">\n              <h4 class=\"modal-title\">Select supertype measurables to replicate</h4>\n          </modal-header>\n          <modal-body>\n              <li *ngFor=\"let option of supertypeMeasurables; let i = index\">\n                <a class=\"small\" href=\"#\">\n                <input type=\"checkbox\" \n                  [(ngModel)]=\"option.selected\" \n                  (ngModelChange)=\"measurablesToReplicateChanged(option)\"/>&nbsp;\n                {{option.value.name}}</a>\n              </li>\n          </modal-body>\n          <modal-footer>\n            <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"close()\">Ok</button>\n          </modal-footer>\n        </modal>\n        \n        <ng-content></ng-content>  \n\n    </template-panel>  \n    \n  ",
            directives: [panel_template_1.TemplatePanel,
                panel_border_1.BorderPanel, component_templateValue_1.TemplateValue, component_select_1.SingleSelectInput, component_select_1.MultiSelectInput, repo_nested_1.RepoNested, ng2_bs3_modal_1.MODAL_DIRECTIVES],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], LyphPanel);
    return LyphPanel;
}(panel_template_1.TemplatePanel));
exports.LyphPanel = LyphPanel;
//# sourceMappingURL=panel.lyph.js.map