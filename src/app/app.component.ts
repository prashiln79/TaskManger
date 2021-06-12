import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title             = 'taskmanager';
  todoLists: any    = [''];
  doneLists: any    = [''];
  priorityList: any = ['Low', 'Medium', 'High']
  statusList: any   = ['On_track', 'At_risk', 'Off_track']
  searchFilter: any = '';
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  assignee: any;
  usersList: any    = [];
  tasksList: any    = [];
  selectedRow: any  = 0;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, public http: HttpClient, private util: UtilService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.getUsersList();
    this.getTasksList();
    this.formTaskData();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }


  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


  public getUsersList() {
    this.http.get('https://devza.com/tests/tasks/listusers')
      .subscribe((data: any) => {
        this.usersList = data?.users;
      }, err => console.log(err));
  }

  genName(name: string) {
    return name[0]
  }

  public getTasksList() {
    this.http.get('https://devza.com/tests/tasks/list')
      .subscribe((data: any) => {
        console.log(data);
      }, err => console.log(err));
    this.tasksList = this.util.getTaskList();
  }

  getassignee(name: any, prop: any) {
    return this.usersList.length > 0 ? (this.usersList.find((data: any) => (data.name == name)))?.[prop] : '';
  }

  formTaskData() {
    this.todoLists = this.tasksList.filter((data: any) => (data.catg == 'todo'));
    this.doneLists = this.tasksList.filter((data: any) => (data.catg == 'done'));
  }

  addTask(data: any) {
    this.util.addTask({
      message: data.taskName,
      due_date: data.dueDate.year + '-' + data.dueDate.month + '-' + data.dueDate.day,
      priority: (this.priorityList.indexOf(data.priority) + 1).toString(),
      assigned_to: data.assignee
    })
  }

  addRow() {
    this.tasksList.push({
      id: this.tasksList.length,
      taskName: '',
      assignee: '',
      dueDate: '',
      priority: '',
      status: '',
      catg: 'todo'
    });
    this.formTaskData();
  }

  deleteTodoLists(id: any) {
    for (var i = 0; i < this.todoLists.length; i++) {
      if (this.todoLists[i].id == id) {
        this.todoLists.splice(i, 1);
        break;
      }
    }
  }

  deleteDoneLists(id: any) {
    for (var i = 0; i < this.doneLists.length; i++) {
      if (this.doneLists[i].id == id) {
        this.doneLists.splice(i, 1);
        break;
      }
    }
  }

  sortBy(prop: any) {
    try {
      this.todoLists = this.todoLists.sort(function (a: any, b: any) {
        let x = a[prop];
        let y = b[prop];
        if (prop == 'dueDate') {
          x = new Date(x.year + '-' + x.month + '-' + x.day);
          y = new Date(y.year + '-' + y.month + '-' + y.day);
          return y - x;
        }
        return x < y ? -1 : x > y ? 1 : 0;
      });
      this.doneLists = this.doneLists.sort(function (a: any, b: any) {
        var x = a[prop];
        var y = b[prop];
        if (prop == 'dueDate') {
          x = new Date(x.year + '-' + x.month + '-' + x.day);
          y = new Date(y.year + '-' + y.month + '-' + y.day);
          return y - x;
        }
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } catch (e) {
      console.log(e)
    }
  }

  filter(type: any, status: any) {
    this.formTaskData();
    if (type == 'dueDate') {
      this.todoLists = this.todoLists.filter((data: any) => data[type].year == status);
      this.doneLists = this.doneLists.filter((data: any) => data[type].year == status);
      return;
    }
    this.todoLists = this.todoLists.filter((data: any) => data[type] == status);
    this.doneLists = this.doneLists.filter((data: any) => data[type] == status);
  }
}