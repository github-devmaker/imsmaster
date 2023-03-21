import { Component, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import * as models from '../models';
import { NetworkService } from '../network.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-ims-master',
  templateUrl: './ims-master.component.html',
  styleUrls: ['./ims-master.component.scss']
})


export class ImsMasterComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  formFilter: FormGroup;
  ngFac: string = '';
  ngLine: string = '';
  ngProId: string = '';
  ngModel: string = '';
  factorys: string[] = ["ALL"];
  listFactory: { [key: string]: string } = environment.listFactory;
  listLine: { [key: string]: string[] } = environment.listLine;
  colsImsMaster: string[] = ['rName', 'pName', 'ptName', 'mId', 'mName', 'pMidDimension', 'pMinDimension', 'pMaxDimension', 'pCycletime', 'pDate', 'pUser', 'pStatus', 'tools'];
  listProgram: models.model_etd_mst_program[] = [];
  listModel: models.model_filter_model[] = [];
  dataSource = null;
  constructor(private network: NetworkService, private fb: FormBuilder, private dialog: MatDialog, private router: Router, private routerActivate: ActivatedRoute) {
    this.formFilter = this.fb.group({
      fac: '',
      line: '',
      proId: '',
      model: ''
    });
    this.ngFac = '1';
    this.ngLine = this.listLine[this.ngFac][0];
  }
  ngAfterViewInit() {
    this.routerActivate.queryParams.subscribe(params => {
      if (params['fac'] != '' && params['fac'] != undefined) {
        this.formFilter.controls['fac'].setValue(params['fac']);
      }
      if (params['line'] != '' && params['line'] != undefined) {
        this.formFilter.controls['line'].setValue(params['line']);
      }
      if (params['proId'] != '' && params['proId'] != undefined) {
        this.formFilter.controls['proId'].setValue(params['proId']);
      }
    })
    this.initFilter(true);
    this.formFilter.valueChanges.subscribe(data => {
      if (data.proId == '') {
        this.formFilter.patchValue({ proId: this.listProgram[0].proId })
      }
    });
  };

  connextSOAP(){
    // this.network.connectSoap().subscribe({
    //   next:(res)=>{
    //     console.log(res);
    //   },error:(err)=>{
    //     console.log(err);
    //   }
    // })
    // this.network.connectSoap().subscribe();
    this.network.connectSoap();
  }
  addModel() {
    const dialogAdd = this.dialog.open(DialogAddModel, {
      width: '50%'
    });
    dialogAdd.afterClosed().subscribe(data => {
      this.initImsMasterData();
    });
  }

  dialogDelete() { }

  dialogEdit(data, filter) {
    console.log(filter);
    const dialogEdit = this.dialog.open(DialogEdit, {
      data: {
        data: { ...data, ...filter },
        fac: filter.fac
      },
      width: '40%'
    });
    dialogEdit.afterClosed().subscribe(data => {
      this.initImsMasterData();
    });
  }

  initFilter(reset: boolean) {
    if (reset) {
      this.formFilter.controls['proId'].setValue(null);
      // this.formFilter.controls['line'].setValue(this.listLine[this.formFilter.controls['fac'].value][0])
    }
    if (!this.listLine[this.formFilter.controls['fac'].value].includes(this.formFilter.controls['line'].value)) {
      // console.log('test')
      this.formFilter.controls['line'].setValue(this.listLine[this.formFilter.controls['fac'].value][0]);
    }
    // console.log(this.formFilter.value);
    this.network.getFilters(this.formFilter.value).subscribe({
      next: (data) => {
        // console.log(data);
        this.listProgram = data.program;
        this.listModel = data.model;
        var newProgram = false;
        if (this.listModel.length) {
          this.listModel.forEach(element => {
            if (element.mId == this.formFilter.value.model) {
              newProgram = true;
            }
          });
        }
        if (reset) {
          this.formFilter.controls['proId'].setValue(this.listProgram[0].proId);
          if (this.listModel.length > 0) {
            this.formFilter.controls['model'].setValue(this.listModel[0].mId);
          }
        }
        this.formFilter.controls['model'].setValue((newProgram || this.listModel.length == 0) ? this.formFilter.value.model : this.listModel[0].mId);
        this.initImsMasterData();
      }, error: (err) => {
        console.log(err);
      }
    })
  };

  initImsMasterData() {
    this.network.getImsMasterData(this.formFilter.value).subscribe({
      next: (res) => {
        // console.log(res);
        this.dataSource = new MatTableDataSource<models.ModelEtdModelDetail>(res);
        if (Object.keys(res).length) {
          this.dataSource.paginator = this.paginator;
        }
      }, error: (res) => {
        this.dataSource = new MatTableDataSource<models.ModelEtdModelDetail>();
        this.dataSource.paginator = this.paginator;
      }
    });
  };

  // pullModel(element,index){
  //   this.network.deleteModel({ ...this.formFilter.value,...element}).subscribe({
  //     next: (res) => {
  //       this.initImsMasterData();
  //     },error: (res) => {
  //       alert(res);
  //     }
  //   });
  // }
  deleteModel(element, index) {
    // console.log(this.formFilter.value);
    this.network.deleteModel({ ...this.formFilter.value, ...element }).subscribe({
      next: (res) => {
        this.initImsMasterData();
      }, error: (res) => {
        alert(res);
      }
    });
  }
}


@Component({
  selector: 'add-model',
  templateUrl: '../dialogs/add-model.component.html',
  styleUrls: ['../dialogs/add-model.component.scss']
})
export class DialogAddModel implements OnInit {
  formRefModel: FormGroup;
  loadingSave: boolean = false;
  formActivity: FormGroup;
  formAddItem: FormGroup;
  usedModel = false;
  usedModelMessage = 'มีการใช้งานโมเดลนี้แล้ว';
  ngFac: string = '';
  listFactory: { [key: string]: string } = environment.listFactory;
  listLine: { [key: string]: string[] } = environment.listLine;
  listProgram = [];
  listModel = [];
  refModel = true;
  newModel = true;
  yourSelectActivity = '';
  colNewModel = ['rName', 'pName', 'ptName', 'mId', 'mName', 'pMidDimension', 'pMinDimension', 'pMaxDimension', 'pCycletime'];
  dataNewModel = [];
  required: boolean = true;
  formModel = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required]
  });
  constructor(private fb: FormBuilder, private network: NetworkService, private snackbar: MatSnackBar, private router: Router) {
    this.formRefModel = this.fb.group({
      fac: '1',
      line: 'Mecha',
      proId: '',
      newModelCode: '',
      newModelName: '',
      mId: '',
      refModel: true
    });
    this.formActivity = this.fb.group({
      activity: ''
    });

    this.initFilter(true);
    this.formRefModel.valueChanges.subscribe(data => {
      this.refModel = !data.refModel;
    });
    this.formActivity.valueChanges.subscribe(data => {
      this.newModel = data.activity == 'newItem' ? false : true;
      this.yourSelectActivity = data.activity;
    });
  }

  modelCodeChange() {
    if (this.formModel.controls['code'].value.length == 0) {
      this.usedModel = false;
      this.required = true;
      this.formModel.controls['name'].setValue('');
    }
    if (this.formModel.controls['code'].value.length >= 3) {
      this.formRefModel.controls['newModelCode'].setValue(this.formModel.controls['code'].value);
      this.network.checkExistMID(this.formRefModel.value).subscribe({
        next: (res) => {
          if (res.content != null && res.content != '' && res.count == 0) {
            this.formModel.controls['name'].setValue(res.content.model);
            this.required = false;
            this.usedModel = false;
          } else if (res.content != null && res.content != '' && res.count > 0) {
            this.formModel.controls['name'].setValue(res.content.model);
            this.required = true;
            this.usedModel = true
            this.usedModelMessage = 'มีการใช้งานโมเดลนี้แล้ว';
          } else {
            this.formModel.controls['name'].setValue('');
            this.required = true;
            this.usedModel = true;
            this.usedModelMessage = res.message;
          }
        }, error: (data) => {
          console.log(data);
        }
      });
    }
  }
  
  trackByFn(index, item) {
    return index;
  }
  ngOnInit(): void {

  }
  filterAddModelChange() {
    this.formRefModel.controls['line'].setValue(environment.listLine[this.formRefModel.value.fac][0]);
    this.formModel.reset();
    this.required = true;
    this.usedModel = false;
    this.usedModelMessage = '';
    this.initFilter(true);
  }

  filterLineChange() {
    this.formModel.reset();
    this.usedModel = false;
    this.usedModelMessage = '';
    this.required = true;
    this.initFilter(true);
  }

  filterProIdChange(newProId: string) {
    this.formRefModel.controls['proId'].setValue(newProId);
    this.initFilter(false);
  }

  filterModelChange(newModel: string) {
    this.formRefModel.controls['mId'].setValue(newModel);
    console.log(this.formRefModel.value);
  }

  initFilter(reset: boolean) {
    if (reset) {
      this.formRefModel.controls['proId'].setValue(null);
    }
    this.network.getFilters(this.formRefModel.value).subscribe({
      next: (data) => {
        this.listProgram = data.program;
        this.listModel = data.model;
        if (this.formRefModel.controls['proId'].value == '' || this.formRefModel.controls['proId'].value == null) {
          this.formRefModel.controls['proId'].setValue(data.program[0].proId);
        } else {
          this.formRefModel.controls['proId'].setValue(data.id);
        }
        this.formRefModel.controls['mId'].setValue(data.modelSelected);
      }, error: (err) => {
      }
    })
  }

  saveModel() {
    var modelCode = this.formModel.controls['code'].value;
    this.loadingSave = true;
    this.formRefModel.patchValue({
      newModelCode: modelCode,
      newModelName: this.formModel.controls['name'].value
    });
    this.network.addModel({ ... this.formRefModel.value, ... this.formModel.value }).subscribe({
      next: (res) => {
        this.loadingSave = false;
        var fac = this.formRefModel.controls['fac'].value;
        var line = this.formRefModel.controls['line'].value;
        var proId = this.formRefModel.controls['proId'].value;
        window.location.href = this.router.url.split('?')[0] + 'imsmaster?fac=' + fac + '&line=' + line + '&proId=' + proId;
      }, error: (err) => {
        alert(err.message);
        this.loadingSave = false;
      }
    });
  }
}

@Component({
  selector: 'dialog-edit',
  templateUrl: '../dialogs/edit/edit.component.html',
})

export class DialogEdit {
  formEdit: FormGroup;
  programData: any;
  itemRank: any = [];
  rank: string = '';
  fac: string;
  constructor(public dialogRef: MatDialogRef<DialogEdit>, @Inject(MAT_DIALOG_DATA) public data: DialogEdit, private network: NetworkService, private fb: FormBuilder) {
    this.fac = data.fac;
    this.programData = data.data;
    this.formEdit = this.fb.group({
      rId: '',
      midDimension: 0,
      maxDimension: 0,
      minDimension: 0
    });
    this.formEdit.setValue({
      rId: this.programData.rId,
      midDimension: this.programData.pMidDimension,
      minDimension: this.programData.pMinDimension,
      maxDimension: this.programData.pMaxDimension
    });
  }
  ngAfterViewInit(): void {
    this.network.getRank(this.fac).subscribe({
      next: (data) => {
        this.itemRank = data;
        if (this.rank == '') {
          this.rank = this.programData.rId;
        }
      }, error: (err) => {
        alert(err.message);
      }
    })
  }

  editModel() {
    if(this.formEdit.controls['midDimension'].value === null){
       console.log('minDimension ' );
    }
    Object.keys(this.formEdit.controls).forEach(key => {
      if(this.formEdit.controls[key].value === null){
        this.formEdit.controls[key].setValue(0);
      }
    })
    var data = { ...this.programData, ...this.formEdit.value };
    this.network.editModel(data).subscribe({
      next: (res) => {
        if (res != null && res.status == true) {
          this.dialogRef.close();
        } else {
          alert('ไม่สามารถแก้ไขข้อมูลได้ เนื่องจาก : ' + res.mes);
        }
      }, error: (err) => {
        alert(err.message);
      }
    });
  }
}
