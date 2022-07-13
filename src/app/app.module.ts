import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider'
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MaterialModule } from './material/material.module';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DebugComponent } from './shared/debug.component';
// import { NgSelectFormlyComponent } from './ng-select.type'; // TRIED WITH TYPES AND NG SELECTS

export function minValidationMessage(err,field: FormlyFieldConfig){ // modified message for age control
  return `Please provide a value bigger than ${err.min}. You provided ${err.actual}`;
}
export function ipValidationMessage(err,field: FormlyFieldConfig){ 
  return `${field.formControl.value} is not a valid IP address.`
}

// export function IpValidator(control: FormControl): ValidationErrors {
//   return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value)
//     ? null
//     : { ip: true };
// }
// THIS FUNCTION IS ALREADY WRITTEN ON APP COMPONENT 
// SO HERE IS JUST FOR SHOWING HOW TO DO IT WITH THIS WAY
// NEXT WE NEED TO ADD THE VALIDATORS SCHEME ON THE ROOT HERE
// AND USE IT BACK ON THE COMPONENT

@NgModule({
  declarations: [
    AppComponent,
    DebugComponent,
    // NgSelectFormlyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      // validators:[{
      //   name: 'ip',
      //   validation: ipValidator
      // }], THIS IS THE WAY WE CAN USE VALIDATORS GLOBALLY !!! 
      validationMessages: [
        {
          name: 'required', // its the name we write in our formly template
          message: 'This field is required'
        },{
          name:'min', // its the name we write in our formly template
          message: minValidationMessage
        },{
          name: 'ip',
          message: ipValidationMessage
        }
      // ],types: [
      //   {
      //     name: 'my-autocomplete',
      //     component: NgSelectFormlyComponent
      //   } supposed way for adding custom type select elements
      ]
    }),
    MaterialModule,
    FormlyMaterialModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
