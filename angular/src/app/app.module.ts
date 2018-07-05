// module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { CloudinaryModule, CloudinaryConfiguration, provideCloudinary } from '@cloudinary/angular-5.x';
import * as cloudinary from 'cloudinary-core';
import { CloudinarySettings } from './service/plugin/app-setting/setting';
import { FileUploadModule } from 'ng2-file-upload';
// service
import { LoginService } from './service/login/login.service';
import { AuthGuard } from './guard/auth.guard';
import { AccountService } from './service/account/account.service';
import { PluginService } from './service/plugin/plugin.service';
import { MenuService } from './service/menu/menu.service';
import { FaqService } from './service/faq/faq.service';
import { BotService } from './service/bot/bot.service';
import { ConfigService } from './service/config/config.service';
import { FbuserService } from './service/fbUser/fbuser.service';
import { UnknownService } from './service/unknown/unknown.service';
import { BroadcastService } from './service/broadcast/broadcast.service';
import { DashboardService } from './service/dashboard/dashboard.service';

// components
import { AppComponent } from './app.component';
import { BotsComponent } from './components/bots/bots.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { LoginComponent } from './Components/login/login.component';
import { BotConfigComponent } from './components/bot-config/bot-config.component';
import { PluginsComponent } from './components/plugins/plugins.component';
import { BotConfigNavComponent } from './components/bot-config-nav/bot-config-nav.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';
import { ConfigureComponent } from './Components/configure/configure.component';
import { FaqsComponent } from './Components/faqs/faqs.component';
import { FbUserComponent } from './Components/fb-user/fb-user.component';
import { UnknownComponent } from './components/unknown/unknown.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { PersonInteractComponent } from './Components/dashboard/person-interact/person-interact.component';
import { UserSatisfactionComponent } from './Components/dashboard/user-satisfaction/user-satisfaction.component';
import { ListTableComponent } from './Components/dashboard/list-table/list-table.component';
import { WebhookComponent } from './Components/webhook/webhook.component';
// material
import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';



const appRoutes: Routes = [
  { path: '', redirectTo: 'bots', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'webhook', component: WebhookComponent, canActivate: [AuthGuard] },
  { path: 'bots', component: BotsComponent, canActivate: [AuthGuard] },
  { path: 'bots/:botId', redirectTo: 'bots/:botId/plugins', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'bots/:botId/:config', component: BotConfigComponent, canActivate: [AuthGuard] },
  { path: 'bots/:botId/plugins/:blockid', component: BotConfigComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    BotsComponent,
    AccountsComponent,
    BotConfigComponent,
    BotConfigNavComponent,
    PluginsComponent,
    BroadcastComponent,
    ConfigureComponent,
    FaqsComponent,
    DashboardComponent,
    FbUserComponent,
    UnknownComponent,
    UserSatisfactionComponent,
    ListTableComponent,
    PersonInteractComponent,
    WebhookComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    FlashMessagesModule,
    BrowserAnimationsModule,
    // material import
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    ChartsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    CloudinaryModule.forRoot(cloudinary, CloudinarySettings),
    FileUploadModule
  ],
  providers: [LoginService, AuthGuard, AccountService, PluginService, MenuService, FaqService, BotService, ConfigService,
    FbuserService, UnknownService, BroadcastService, DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
