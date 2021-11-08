import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import MyPokemon from "./components/MyPokemon";
import Details from "./components/Details";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/dashboard">
          <Navbar />
          <Dashboard />
          <Footer />
        </Route>
        <Route path="/my-pokemon">
          <Navbar />
          <MyPokemon />
          <Footer />
        </Route>
        <Route path="/details/:id">
          <Navbar />
          <Details />
          <Footer />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
