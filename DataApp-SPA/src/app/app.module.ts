import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from 'ngx-gallery';
import { HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AuthGuard } from './_guards/auth.guard';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { environment } from 'src/environments/environment';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { AlertifyService } from './_services/alertify.service';
import { UserService } from './_services/user.service';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import { MessagesResolver } from './_resolvers/messsages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';


export function _tokenGetter() {
  return localStorage.getItem('token');
}

export class CustomHammerConfig extends HammerGestureConfig  {
  overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    MessagesComponent,
    ListsComponent,
    MemberCardComponent,
    MemberDetailsComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TimeAgoPipe,
    MemberMessagesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgxGalleryModule,
    FileUploadModule,
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: _tokenGetter,
        whitelistedDomains: [environment.whitleListTokenAdress],
        blacklistedRoutes: [environment.blackListTokenAdress],
      },
    }),
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    MessagesResolver,
    ListsResolver,
    AuthGuard,
    PreventUnsavedChanges,
    UserService,
    AlertifyService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
