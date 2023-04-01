import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { differenceWith, intersectionWith, isEqual } from 'lodash';
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime,tap,switchMap, take } from 'rxjs/operators';
import { AtsModelService } from 'src/app/services/ats-model.service';
import { DocumentCreatorService } from 'src/app/services/document-creator.service';


interface Act{
  title: string,
  text:string
}
interface Document{
  title: string,
  text:string
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ats$!: Observable<Act[]>;
  loading:boolean = false;
  name:string | null = '';
  documents:Document[] | [] = [];
  form = this.formBuilder.group({
    name: [''],
    paragraphs: this.formBuilder.array([])
  });
  constructor(
    private formBuilder: FormBuilder,
    public atsService: AtsModelService,
    private _docCreator:DocumentCreatorService
  ) { }

  paragraphs() : FormArray {  
    return this.form.get("paragraphs") as FormArray  
  }  
  updateData(index: number, event:any) {
    const myForm = (<FormArray>this.form.get("paragraphs")).at(index);
    let currentVal = event.target.innerHTML;
    myForm.patchValue({
      paragraph: currentVal
    });
    // this.hideArray[index] = currentVal;
    document.getElementById('act'+1)?.focus();
  }
  newParagraphs(text:string): FormGroup {  
    return this.formBuilder.group({  
      paragraph: [text] 
    })  
  }  
  addParagraphs(text:string) {  
    this.paragraphs().push(this.newParagraphs(text));  
  }  
  removeParagraph(i:number) {  
    this.paragraphs().removeAt(i);  
  }  
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.addParagraphs(event.option.value.text);
}
getOptionText(option:any) {
  return option.title;
}

  ngOnInit(){
     this.ats$ = this.form.get('name')!.valueChanges.pipe(
    tap(()=> this.loading = true),
    distinctUntilChanged(),
    debounceTime(1000),
    switchMap(name => {
      this.name = name;
      this.loading = false;
     return this.atsService.getByName(name)
    })
  )

  this.paragraphs().valueChanges.subscribe(val => {
       this.calculateDocuments();
  })
  }
  calculateDocuments(){
    let allTextAreas =  Array.prototype.slice.call(document.querySelectorAll('.ql-editor'));
    if(allTextAreas.length > 0){
      allTextAreas?.map(d => (Array.prototype.slice.call(d.children).map(e => e.innerHTML))).flat().reduce((acc,curr)=>acc+curr)
        // let allTextAreas = Array.prototype.slice.call(document.querySelectorAll('.ql-editor').);
          this.documents = this.extractWords(allTextAreas?.map(d => (Array.prototype.slice.call(d.children).map(e => e.innerHTML))).flat().reduce((acc,curr)=>acc+curr));
    }

  }
  findLast = (arr:any, fn:any) => arr.filter(fn).pop();
  extractWords(str:string) {
    let words:any = [];
    for (let i = 0; i < str.length; i++) {
        if (str.includes(';') && str.charAt(i) == ':') {
            const stopIndex = str.indexOf(';', i);
            if (stopIndex !== -1){
              let documentText = str.slice(
                str.lastIndexOf(str.substring(i + 1, stopIndex)), //dove inizia la parola incriminata
                str.lastIndexOf(str.substring(i + 1, stopIndex).length.toString()))//fino a quanto è lunga la parola incriminata
                .split('&gt')[1]?.replace('; ','');
              words.push({
                title:str.substring(i + 1, stopIndex).replace('&gt', ''), 
                text: str.substring(i+1).indexOf('&gt;') !== -1 ? str.substring(i+1).split('&gt;')[1].substring(0,  str.substring(i+1).split('&gt;')[1].indexOf(';')): ''
              });
            }
        }
    }

    return words;
  }
  notEqual(value1:any, value2:any){
    return !isEqual(value1, value2)
  }
  downloadWord(){
    this._docCreator.create(this.form.value.paragraphs);
  }
  drop(event: CdkDragDrop<AbstractControl<any, any>[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    setTimeout(() => {
      this.calculateDocuments()
    }, 200);
  }

  get paragraphsNumber(){
    return this.form.controls.paragraphs
  }
  
}
