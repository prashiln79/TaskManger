import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(public http: HttpClient) { }


  addTask(data: any) {
    //This Api was not working due to whc data is store in js object ////
    this.http.post('https://devza.com/tests/tasks/create',
      data).subscribe(data => {
        console.log(data);
      });

  }

  getTaskList() {
    return [{
      id: 1,
      taskName: 'Nodejs ',
      assignee: 'Arpit',
      dueDate: {
        "year": 2018,
        "month": 8,
        "day": 15
      },
      priority: 'Low',
      status: 'On_track',
      catg: 'todo'
    },
    {
      id: 2,
      taskName: 'Angular upgrade',
      assignee: 'Dushyant',
      dueDate: {
        "year": 2019,
        "month": 8,
        "day": 15
      },
      priority: 'High',
      status: 'At_risk',
      catg: 'todo'
    },
    {
      id: 3,
      taskName: 'test1',
      assignee: 'Shobha',
      dueDate: {
        "year": 2020,
        "month": 8,
        "day": 15
      },
      priority: 'Medium',
      status: 'Off_track',
      catg: 'done'
    }
    ]
  }
}
