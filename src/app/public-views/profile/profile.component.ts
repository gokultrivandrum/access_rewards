import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProfileService } from 'app/shared/services/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'app/shared/services/register.service';
import { User } from 'app/public-views/signup/User';
import { WebStorageService } from 'app/shared/services/web-storage.service';
import { ToastsManager } from 'ng2-toastr';
import { AppSettings } from 'app/app.constant';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  public loading = false;
  availablePoints: any;
  public configConstant = AppSettings;

  // Property for the user
  private user: User;
  public userDetails: any;
  // Gender list for the select control element
  genderList: string[];
  signupForm: FormGroup;
  signupFormUae: FormGroup;

  public disableClick = false;



  day: number;
  month: string;
  year: number;

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:member-ordering
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  years = [];

  // Inject the formbuilder into the constructor
  constructor(
    private fb: FormBuilder,
    public registerService: RegisterService,
    public profileService: ProfileService,
    private _webStorageService: WebStorageService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.loading = true;



    // Use the formbuilder to build the Form model
    this.signupForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      MobileNo: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      email: ['', [Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      ChildName: [''],
      childDay: [''],
      childMonth: [''],
      childYear: [''],
      PinCode: [''],
      annDay: [''],
      annMonth: [''],
      annYear: [''],
      Gender: [''],
      countrycode: [''],
    });
    // Use the formbuilder to build the Form model
    this.signupFormUae = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      PhoneNo: ['', Validators.required],
      EmailAddress: ['', [Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      Nationality: [''],
      Gender: [''],
      CountryCode: [''],
    });
  }
  ngOnInit() {

    if (AppSettings.currentCountry === 'india') {
      this.getProfileDetails();
      this.getCustomerAvailablePoints();
    } else {
      this.getProfileDetailsUae();
    }

    const d = new Date();
    for (let i = (d.getFullYear()); i > (d.getFullYear() - 100); i--) {
      this.years.push(i);
    }
  }
  getProfileDetails() {

    const demo = {
      'mobile': this._webStorageService.getData('mobile')
    };

    let responseData: any;
    this.profileService.getProfileDetails(
      AppSettings.API_ENDPOINT + AppSettings.Searchmember, demo).subscribe(
      data => responseData = data,
      error => {
        console.error('api ERROR');
        this.loading = false;

      },
      () => {
        console.log('responseData', new Date(responseData.DateOfBirth));
        this.loading = false;
        this.userDetails = {};
        this.userDetails.ChildName = '';
        this.userDetails = responseData;
        const date = new Date(responseData.DateOfBirth);

        if (date) {
          this.userDetails.day = this.days[date.getDate() - 1];
          this.userDetails.month = this.months[date.getMonth()];
          this.userDetails.year = date.getUTCFullYear();
        }
        const childDate = new Date(responseData.ChildDOB);

        console.log(childDate.getDate(), childDate.getMonth(), childDate.getUTCFullYear());
        if (childDate) {
          this.userDetails.childDay = this.days[childDate.getDate() - 1];
          this.userDetails.childMonth = this.months[childDate.getMonth()];
          this.userDetails.childYear = childDate.getUTCFullYear();
        }

        const annviersaryTimeDate = new Date(responseData.AnniversaryDate);

        console.log(annviersaryTimeDate.getDate(), annviersaryTimeDate.getMonth(), annviersaryTimeDate.getUTCFullYear());
        if (annviersaryTimeDate) {
          this.userDetails.annDay = this.days[annviersaryTimeDate.getDate() - 1];
          this.userDetails.annMonth = this.months[annviersaryTimeDate.getMonth()];
          this.userDetails.annYear = annviersaryTimeDate.getUTCFullYear();
        }
        console.log("this.userDetails", this.userDetails);



      });
  }
  getProfileDetailsUae() {

    const demo = {
      'secretToken': this._webStorageService.getData('SecretToken')
    };

    let responseData: any;
    this.profileService.getProfileDetailsUae(
      AppSettings.API_ENDPOINT + AppSettings.SearchmemberUae, demo).subscribe(
      data => responseData = data,
      error => {
        console.error('api ERROR');
        this.loading = false;

      },
      () => {
        console.log('responseData', responseData);
        this.loading = false;
        if (responseData.Data) {
          this.userDetails = responseData.Data;
          if (this.userDetails.BirthDate) {
            const date = new Date(this.userDetails.BirthDate);

            if (date) {
              this.userDetails.day = this.days[date.getDate() - 1];
              this.userDetails.month = this.months[date.getMonth()];
              this.userDetails.year = date.getUTCFullYear();
            }
          }
        } else {
          this.userDetails = '';
        }




      });
  }
  getCustomerAvailablePoints() {

    const demo = {
      'mobile': this._webStorageService.getData('mobile')
    };

    let responseData: any;
    this.profileService.getCustomerAvailablePoints(
      AppSettings.API_ENDPOINT + AppSettings.CustomerAvailablePoints, demo).subscribe(
      data => responseData = data,
      error => {
        console.error('api ERROR');
      },
      () => {
        console.log('zxcxzc', responseData);
        this.availablePoints = responseData.availablePointsl

      });
  }
  public onFormSubmit() {

    this.loading = true;

    this.user = this.signupForm.value;
    this.user.DateOfBirth = this.signupForm.value.day + ' ' + this.signupForm.value.month + ' ' + this.signupForm.value.year;
    this.user.ChildDOB = this.signupForm.value.childDay + ' ' + this.signupForm.value.childMonth + ' ' + this.signupForm.value.childYear;
    this.user.AnniversaryDate = this.signupForm.value.annDay + ' ' + this.signupForm.value.annMonth + ' ' + this.signupForm.value.annYear;
    console.log(this.user);


    let responseData: any;
    this.registerService.registerToApp(
      AppSettings.API_ENDPOINT + AppSettings.RegisterEasyAccount,
      this.user).subscribe(
      data => responseData = data,
      error => {
        console.error('api ERROR');
        this.loading = false;

      },
      () => {
        this.loading = false;

        console.log('responseData', responseData);
        this.toastr.success('Profile updated successfully.', 'Success!');

        this.getProfileDetails();
        this.getCustomerAvailablePoints();
      });
  }
  public onFormSubmitUae() {

    this.loading = true;

    this.user = this.signupFormUae.value;
    console.log('demo', this.signupFormUae.value);

    this.user.BirthDate = this.signupFormUae.value.day + ' ' + this.signupFormUae.value.month + ' ' + this.signupFormUae.value.year;
    this.user.secretToken = this._webStorageService.getData('SecretToken');
    console.log(this.user);


    let responseData: any;
    this.registerService.registerToUaeApp(
      AppSettings.API_ENDPOINT + AppSettings.uaeSetGuest,
      this.user).subscribe(
      data => responseData = data,
      error => {
        console.error('api ERROR');
        this.loading = false;

      },
      () => {
        this.loading = false;

        console.log('responseData', responseData);
        this.toastr.success('Profile updated successfully.', 'Success!');

        this.getProfileDetailsUae();
      });
  }
}
