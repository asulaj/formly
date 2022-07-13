import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataService } from './services/data.service';
import { switchMap, startWith } from 'rxjs/operators';

export function IpValidator(control: FormControl): ValidationErrors {
  return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value)
    ? null : { ip: true }
}
const formlyRow = (fieldConfig: FormlyFieldConfig[])=>{ // we remake the request better inste4ad of giga nesting everything
  return {
    fieldGroupClassName: 'display-flex',
    fieldGroup: fieldConfig
  }
};
const formlyInput = (config: {key: string,label:string,templateOptions:any}): FormlyFieldConfig =>{
  return {    
      key: config.key,
      type: 'input',
      className: 'flex-3',
      templateOptions: {
        label: config.label,
        ...config.templateOptions
      }
  }
}; // function to pre configure inputs 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  form = new FormGroup({}); // its the classic reactive form group that we use on the form element html
  model = { //it's the model we show on the form element inputs
    id: 14143423,
    firstname: 'Juri',
    age: 34,
    nationId: 1,
    cityId: 1,
    ip: null,
  };
  fields: FormlyFieldConfig[] = [ // here we create the input fields with key name and type input, plus 
    //templates with label, type text or number etc, labels w/e html allows us 
    {
      key: 'id', // the id gets data binded when you hand it over somewhere so it can be sent to the server, but will not be seen on the client
    },
    formlyRow(
      [formlyInput(
        {
          key: 'Firstname',
          label: 'Firstname',
          templateOptions: {
          required: true
          }
        }
      ),
      {
        key: 'age',
        type: 'input',
        className: 'flex-1',
        templateOptions: {
          type: 'number',
          label: 'Age',
          required: true,
          min: 18,
        },
        validation: {
          messages: {
            min: 'Sorry you have to be over 18 years old, please enter a valid age.',
            required: 'Please enter you age!'
          }
        }
      }]
    ),
    {
      fieldGroupClassName:'display-flex',
      fieldGroup: [{
        key: 'nationId',
        // type: 'my-autocomplete',
        type: 'select', // <select>
        className: 'flex-3',
        templateOptions: {
          label: 'Nation',
          options: this.dataService.getNations() // we get the nations from our observable in dataService
        }
      },
      {
        key: 'cityId',
        type: 'select', // <select> 
        className: 'flex-3',
        templateOptions: {
          label: 'Cities',
          options: []
        },
        expressionProperties: {
          'templateOptions.disabled': model => !model.nationId, //disable the city options if we don't have a nationId selected
          'model.cityId': '!model.nationId ? null : model.cityId', // it doesnt let him save the last city state when there is a return to a null nation state
          //'hideExpression': '!model.nationId' this one down here can be written also here!
        },
        hideExpression: '!model.nationId',//this can be another solution :  model => !model.nationId, 
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            field.templateOptions.options = field.form
              .get('nationId')
              .valueChanges.pipe(
                startWith(this.model.nationId),
                switchMap(nationId => this.dataService.getCities(nationId))
              );
          }
        }
      }
      ]
    },
    {
      key: 'ip',
      type: 'input',
      templateOptions: {
        label: 'Ip Address',
        required: true,
      },
      validators: {
        validation: [IpValidator]
      },
      // validators: {
      //   // validation: ['ip'] //  WE CALL THE VALIDATORS DEFINED GLOBALLY ONLY
      //   ip2: { // OR WE DEFINE THE VALIDATORS HERE EASILY WITH A NAME AND EXPRESSION, MESSAGE
      //     expression: c => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
      //     message: (errorr, field: FormlyFieldConfig) =>
      //       `"${field.formControl.value}" is not valid`
      //   }
      // }
    }
  ];

  constructor(private dataService: DataService) { }

  onSubmit({ valid, value }) {
    console.log(value);
  }
}