import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class InnerCommunicationService {
    @Output() parentAddedChild = new EventEmitter<boolean>();

    triggerParentAddedChild() {
        this.parentAddedChild.emit(true);
    }
}