import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing Module of App
// Deals with all routing
const appRoutes: Routes = [
	{ path: '',  redirectTo: '/map', pathMatch: 'full'},
  {
    path: "map",
    loadChildren: () =>
      import("./map/map.module").then(
        m => m.MapModule
      )
  },
  {
    path: "drivers",
    loadChildren: () =>
      import("./drivers/drivers.module").then(
        m => m.DriversModule
      )
  },
  { path: 'login', component: LoginComponent},
  {
    path: "pickups",
    loadChildren: () =>
      import("./pickups/pickups.module").then(
        m => m.PickupsModule
      )
  }

  // {
  //   path: "recipes",
  //   loadChildren: () =>
  //     import("./recipes/recipes.module").then(m => m.RecipesModule)
  // },
  // { path: '', component: RecipesComponent, canActivate: [AuthGuard], children: [
  //   { path: '', component: RecipeStartComponent},
  //   { path: 'new', component: RecipeEditComponent},
  //   { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
  //   { path: ':id/edit', component: RecipeEditComponent},

  // ]},
  // {
  //   path: "shopping-list",
  //   loadChildren: () =>
  //     import("./shopping-list/shopping-list.module").then(
  //       m => m.ShoppingListModule
  //     )
  // },
  // {
  //   path: "auth",
  //   loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
  // }	// { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) }
]

@NgModule({
	imports: [FormsModule, ReactiveFormsModule,
		RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
