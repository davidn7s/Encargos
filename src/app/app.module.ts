import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// import firebase + enviornment
import { AngularFireModule } from '@angular/fire/compat';
import {  firebaseConfig } from '../environments/environment';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    PipesModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FireServiceProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
