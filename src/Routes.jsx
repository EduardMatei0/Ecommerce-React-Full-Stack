import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import Home from "./core/Home";
import PrivateRoute from "./auth/PrivateRoutes";
import Dashboard from "./user/UserDashboard";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Orders from "./admin/Orders";
import Profile from "./user/Profile";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/shop" exact component={Shop} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
        <PrivateRoute path="/profile/:userId" exact component={Profile} />
        <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
        <AdminRoute path="/admin/orders" exact component={Orders} />
        <AdminRoute path="/create/category" exact component={AddCategory} />
        <AdminRoute path="/create/product" exact component={AddProduct} />
        <AdminRoute
          path="/admin/product/update/:productId"
          exact
          component={UpdateProduct}
        />
        <AdminRoute path="/admin/products" exact component={ManageProducts} />
        <Route path="/product/:productId" exact component={Product} />
        <Route path="/cart" exact component={Cart} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
