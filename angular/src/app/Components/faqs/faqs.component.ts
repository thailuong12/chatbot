import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FaqService } from './../../service/faq/faq.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Element } from '@angular/compiler';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {
  animal: string;
  name: string;
  botID: String
  faqList:any
  addFaqForm: FormGroup
  selectedRowIndex = -1;

  displayedColumns = ['question', 'answer', 'delete'];
  dataSource = new MatTableDataSource(this.faqList);




  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private FaqService: FaqService) { 
      this.botID = this.activatedRoute.snapshot.paramMap.get("botId")
      this.getAllFaq()
      this.createAddFaqForm()
      
    }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ngOnInit() {
  

  }
  getAllFaq() {
    this.FaqService.getAllFaqs(this.botID).subscribe(res => {
      if (res.success == true) {
        this.faqList = res.list;
        this.dataSource = new MatTableDataSource(this.faqList);
      }
    })
  }
  createAddFaqForm() {
    this.addFaqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]   
    });
  }
  resetAddFaqForm(){
    this.addFaqForm.reset();
  }
  addFaq(){
    let question = this.addFaqForm.get('question').value
    let answer = this.addFaqForm.get('answer').value
    
    this.FaqService.addFaq(this.botID,question,answer).subscribe(res=>{
      console.log(res)
      if (res.success == true) {
       
        this.addFaqForm.reset();
        
        this.getAllFaq()
       
      }
    })
  }
  editQuestionFaq(event,question,answer,id){
    this.FaqService.editQuestionFaq(this.botID,event.currentTarget.value,question,answer,id).subscribe(res=>{
      if (res.success == true) {
       
       
      }
    })
  }
  editAnswerFaq(event,question,answer,id){
   
    this.FaqService.editAnswerFaq(this.botID,event.currentTarget.value,question,answer,id).subscribe(res=>{
      if (res.success == true) {
      }
    })
  }
  deleteFaq(question,answer){
    this.FaqService.deleteFaq(this.botID,question,answer).subscribe(res=>{
      if (res.success == true) {
        this.getAllFaq()
       
      }
    })
  }

}







