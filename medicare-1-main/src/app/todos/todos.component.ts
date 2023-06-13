import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Medicine } from "../medicine";
import { TodoService } from "../todo.service";
import {
  FormGroup,
  FormControl,
} from "@angular/forms";
import * as moment from "moment";
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';




@Component({
  selector: "app-todos",
  templateUrl: "./todos.component.html",
  styleUrls: ["./todos.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TodosComponent implements OnInit {
  hidden = true;
  breakpoint: number | undefined;
  height!: string | number;
  todos: Medicine[] = [];
  selected = "1";
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  phoneNumber!: string;

  constructor(private todoService: TodoService , private http: HttpClient) {}
  

  ngOnInit(): void {
    this.loadTodos();
    var clicked = false;
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2;
    this.height = window.innerWidth <= 600 ? "200px" : "500px";
    document.getElementById('myTopnav')!.style.display = 'block';

    this.sendSMSNotification(); // Call the function directly


    // Set Interval for SMS
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Adjust the hours as per your timezone
      if (hours === 3 || hours === 13 || hours === 17 || hours === 21) {
        this.sendSMSNotification();
      }
    }, 60000); // Check every minute
  
  }

  sendSMSNotification() {
    const accountSid = 'AC883d01cff9800d599a402911cd9028ca';
    const authToken = '867ec02396435649ebf882fbad533166';
    const twilioNumber = '+13613092096';
    const recipientNumber = this.phoneNumber;
    // const recipientNumber = '+8801840656367';
    const message = 'Take Medicine Now!';

    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams();
    body.set('To', recipientNumber);
    body.set('From', twilioNumber);
    body.set('Body', message);

    this.http.post(endpoint, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
      }
    }).subscribe({
      complete: () => {
        console.log('SMS notification sent successfully.');
      },
      error: (error) => {
        console.error('Failed to send SMS notification:', error);
      }
    }
  );    
}

onSendSMS() {
  this.sendSMSNotification();
}
  



  //Datepicker----------------------------------------------------------------------------------------------------------------------------------------

  //erzeugt mehrere Events, da ein Mediakament mehrere Tage eingenommen werden muss -------------------------------------------------------
  async splitTimeslot(
    medicine: string,
    description: string,
    consumption_monday: boolean,
    consumption_tuesday: boolean,
    consumption_wednesday: boolean,
    consumption_thursday: boolean,
    consumption_friday: boolean,
    consumption_satturday: boolean,
    consumption_sunday: boolean,
    consumption_morning: boolean,
    consumption_midday: boolean,
    consumption_evening: boolean
  ) {
    //overlay wird ausgeblendet -------------------------------------------------------------------------------------------------------------------
    this.deleteVisibilty();

    const startDate = this.range.get("start")?.value;
    var endDate = this.range.get("end")?.value;

    for (
      var day = new Date(startDate);
      day <= endDate;
      day.setDate(day.getDate() + 1)
    ) {
      var consumption = day;
      if (consumption_monday === true && day.getDay() === 1) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_tuesday === true && day.getDay() === 2) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_wednesday === true && day.getDay() === 3) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_thursday === true && day.getDay() === 4) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_friday === true && day.getDay() === 5) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_satturday === true && day.getDay() === 6) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
      if (consumption_sunday === true && day.getDay() === 0) {
        this.add(
          medicine,
          description,
          consumption_monday,
          consumption_tuesday,
          consumption_wednesday,
          consumption_thursday,
          consumption_friday,
          consumption_satturday,
          consumption_sunday,
          consumption,
          consumption_morning,
          consumption_midday,
          consumption_evening
        );
      }
    }
    //weitere Todos werden geladen -------------------------------------------------------------------------------------------------------------------
    await this.loadTodos();
    this.remove();
  }

  //Hinzufügen von Einträgen ---------------------------------------------------------------------------------------------------------------------
  async add(
    medicine: string,
    description: string,
    consumption_monday: boolean,
    consumption_tuesday: boolean,
    consumption_wednesday: boolean,
    consumption_thursday: boolean,
    consumption_friday: boolean,
    consumption_satturday: boolean,
    consumption_sunday: boolean,
    consumption: Date,
    consumption_morning: boolean,
    consumption_midday: boolean,
    consumption_evening: boolean
  ) {
    var id = await this.todoService.add(
      medicine,
      description,
      consumption,
      consumption_monday,
      consumption_tuesday,
      consumption_wednesday,
      consumption_thursday,
      consumption_friday,
      consumption_satturday,
      consumption_sunday,
      consumption_morning,
      consumption_midday,
      consumption_evening
    );
    await this.loadTodos();
    //Behebt Bug, dass Elemente mehrfache in den Kalender geladen werden -----------------------------------------------------------------------------
   window.location.reload();
  }

  async sync() {
    await this.todoService.sync();
    await this.loadTodos();
  }

  async delete(todo: Medicine) {
    await this.todoService.deleteToDo(todo);
    await this.loadTodos();
  }
  async loadTheOne(todo: Medicine) {
    await this.todoService.getToDo(todo);
  }

  async loadTodos() {
    this.todos = await this.todoService.getAll();
    this.sortByDueDate();
    // Elemente werden in den Kalender geladen
    this.todoService.syncCalendar();
    //Check ob, ein Platzhaltertext angezeigt wird, weil keine Medikamente eingetragen sind
    this.togglePlaceholder();
  }

  async sortByDueDate() {
    this.todos.sort((a: Medicine, b: Medicine) => {
      return a.consumption!.getTime() - b.consumption!.getTime();
    });
  }

  async addVisibilty(): Promise<void> {
    document.getElementById("add")!.style.display = "block";
  }

  async deleteVisibilty(): Promise<void> {
    document.getElementById("add")!.style.display = "none";
  }

  remove(): void {
    document.getElementsByClassName("visible")[0].classList.remove("visible");
    document.getElementById("AddButton")?.classList.remove("notVisible");
    document.getElementById("AddButton")?.classList.add("visible");
    document.getElementById("add")?.classList.add("notVisible");
  }
  checkOverdue(todo: Medicine) {
    var today = new Date();

    if (todo.consumption < today) {
      var element = document.getElementById(todo.id);
      element?.classList.add("overdue");

      this.showBadge();
    }
  }

  showBadge() {
    this.hidden = false;
  }
  resetBadge() {
    this.hidden = true;
  }

  async togglePlaceholder() {
    var todos = this.todoService.getAll();
    if ((await todos).length === 0) {
      document.getElementById("placeholder")!.style.display = "block";
      if (window.innerWidth > 500) {
        document.getElementById("placeholderBottom")!.style.display = "block";
      }
    } else {
      document.getElementById("placeholder")!.style.display = "none";
      document.getElementById("placeholderBottom")!.style.display = "none";
    }
  }

  onResize(event: any) {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
    this.height = event.target.innerWidth <= 600 ? "200px" : "500px";
    if (window.innerWidth <= 500) {
      document.getElementById("placeholderBottom")!.style.display = "none";
    } else {
      document.getElementById("placeholderBottom")!.style.display = "block";
    }
  }
  formatDate(date: Date) {
    var DateFormated = moment(date).format("DD-MM-YYYY");
    return DateFormated;
  }
}
